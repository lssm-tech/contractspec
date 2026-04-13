package tech.lssm.contractspec.actions

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.BridgeResponse
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

internal fun getBridgeService(project: Project): NodeBridgeService? {
    val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java) ?: return null
    if (bridgeService.ensureBridgeRunning()) {
        return bridgeService
    }

    Messages.showErrorDialog(
        project,
        "Failed to start the ContractSpec bridge. Ensure Node.js is installed and the JetBrains bridge has been built.",
        "Bridge Server Error"
    )
    return null
}

internal fun trackEvent(eventName: String) {
    ApplicationManager.getApplication()
        .getService(TelemetryService::class.java)
        ?.trackEvent(eventName)
}

internal fun runBackgroundBridgeAction(
    project: Project,
    taskTitle: String,
    request: () -> BridgeResponse,
    formatter: (BridgeResponse) -> Pair<String, String>
) {
    ProgressManager.getInstance().run(object : Task.Backgroundable(project, taskTitle, true) {
        override fun run(indicator: ProgressIndicator) {
            indicator.isIndeterminate = true
            indicator.text = taskTitle

            try {
                val response = request()
                ApplicationManager.getApplication().invokeLater {
                    if (!response.success) {
                        Messages.showErrorDialog(
                            project,
                            response.error ?: "Unknown ContractSpec bridge error.",
                            "ContractSpec Error"
                        )
                        return@invokeLater
                    }

                    val (title, message) = formatter(response)
                    Messages.showInfoMessage(project, message, title)
                }
            } catch (error: Exception) {
                ApplicationManager.getApplication().invokeLater {
                    Messages.showErrorDialog(
                        project,
                        error.message ?: "Unknown ContractSpec error.",
                        "ContractSpec Error"
                    )
                }
            }
        }
    })
}

internal fun formatSetupMessage(defaultSummary: String, data: JsonObject?): Pair<String, String> {
    val preset = data?.getString("preset")
    val filesModified = data.getStringList("filesModified")
    val nextSteps = data.getStringList("nextSteps")
    val warnings = data.getStringList("warnings")
    val errors = data.getStringList("errors")

    val message = buildString {
        append(defaultSummary)
        if (!preset.isNullOrBlank()) {
            append("\n\nPreset: $preset")
        }
        append("\nConfig created: ${data?.getBoolean("configCreated") ?: false}")
        if (filesModified.isNotEmpty()) {
            append("\n\nFiles modified:")
            filesModified.forEach { append("\n• $it") }
        }
        if (nextSteps.isNotEmpty()) {
            append("\n\nNext steps:")
            nextSteps.forEach { append("\n• $it") }
        }
        if (warnings.isNotEmpty()) {
            append("\n\nWarnings:")
            warnings.forEach { append("\n• $it") }
        }
        if (errors.isNotEmpty()) {
            append("\n\nReported issues:")
            errors.forEach { append("\n• $it") }
        }
    }

    return "ContractSpec Setup" to message
}

internal fun formatDoctorMessage(data: JsonObject?): Pair<String, String> {
    val checks = data?.getAsJsonArray("checks")?.mapNotNull { it.asJsonObjectOrNull() } ?: emptyList()
    val recommendations = data.getStringList("recommendations")
    val summary = if (data?.getBoolean("healthy") == true) "Healthy" else "Issues detected"

    val message = buildString {
        append("Status: $summary")
        if (checks.isNotEmpty()) {
            append("\n\nChecks:")
            checks.forEach { check ->
                val status = check.getString("status") ?: "unknown"
                val name = check.getString("name") ?: "Unnamed check"
                val description = check.getString("message") ?: ""
                append("\n• [$status] $name")
                if (description.isNotBlank()) {
                    append(" — $description")
                }
            }
        }
        if (recommendations.isNotEmpty()) {
            append("\n\nRecommendations:")
            recommendations.forEach { append("\n• $it") }
        }
    }

    return "ContractSpec Doctor" to message
}

internal fun formatWorkspaceInfoMessage(data: JsonObject?): Pair<String, String> {
    val message = buildString {
        append("Workspace root: ${data?.getString("workspaceRoot") ?: "(unknown)"}")
        append("\nPackage manager: ${data?.getString("packageManager") ?: "(unknown)"}")
        append("\nMonorepo: ${data?.getBoolean("isMonorepo") ?: false}")
        data?.getString("packageRoot")?.takeIf { it.isNotBlank() }?.let {
            append("\nPackage root: $it")
        }
        data?.getString("packageName")?.takeIf { it.isNotBlank() }?.let {
            append("\nPackage name: $it")
        }
        append("\nSpecs found: ${data?.getInt("specsFound") ?: 0}")
        append("\nFeatures found: ${data?.getInt("featuresFound") ?: 0}")
    }
    return "ContractSpec Workspace Info" to message
}

internal fun formatIntegrityMessage(data: JsonObject?): Pair<String, String> {
    val orphanedSpecs = data?.getAsJsonArray("orphanedSpecs")?.size() ?: 0
    val issues = data?.getAsJsonArray("issues")?.mapNotNull { it.asJsonObjectOrNull() } ?: emptyList()
    val inventory = data?.getAsJsonObject("inventory")

    val message = buildString {
        append("Orphaned specs: $orphanedSpecs")
        append("\nIssues: ${issues.size}")
        if (inventory != null) {
            append("\n\nInventory:")
            inventory.entrySet().forEach { (key, value) ->
                val count = if (value.isJsonObject) value.asJsonObject.entrySet().size else 0
                append("\n• $key: $count")
            }
        }
        if (issues.isNotEmpty()) {
            append("\n\nTop issues:")
            issues.take(10).forEach { issue ->
                val severity = issue.getString("severity") ?: "unknown"
                val type = issue.getString("type") ?: "issue"
                val messageText = issue.getString("message") ?: ""
                append("\n• [$severity] $type")
                if (messageText.isNotBlank()) {
                    append(" — $messageText")
                }
            }
            if (issues.size > 10) {
                append("\n• …and ${issues.size - 10} more")
            }
        }
    }

    return "ContractSpec Integrity" to message
}

private fun JsonObject?.getBoolean(name: String): Boolean? =
    this?.get(name)?.takeIf { !it.isJsonNull }?.asBoolean

private fun JsonObject?.getInt(name: String): Int? =
    this?.get(name)?.takeIf { !it.isJsonNull }?.asInt

private fun JsonObject?.getString(name: String): String? =
    this?.get(name)?.takeIf { !it.isJsonNull }?.asString

private fun JsonObject?.getStringList(name: String): List<String> =
    this?.getAsJsonArray(name)?.mapNotNull { element ->
        when {
            element.isJsonNull -> null
            element.isJsonPrimitive -> element.asString
            else -> element.toString()
        }
    } ?: emptyList()

private fun JsonElement.asJsonObjectOrNull(): JsonObject? =
    if (isJsonObject) asJsonObject else null
