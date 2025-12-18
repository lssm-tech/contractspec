package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

/**
 * Action to list all spec files in the workspace.
 */
class ListSpecsAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_list_specs")

        // Get bridge service
        val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
        if (!bridgeService.ensureBridgeRunning()) {
            Messages.showErrorDialog(
                project,
                "Failed to start ContractSpec bridge server. Please check your Node.js installation.",
                "Bridge Server Error"
            )
            return
        }

        // List specs asynchronously
        bridgeService.listSpecs().thenAccept { response ->
            ApplicationManager.getApplication().invokeLater {
                if (response.success && response.data != null) {
                    val specs = response.data.get("specs")?.asJsonArray

                    if (specs == null || specs.size() == 0) {
                        Messages.showInfoMessage(
                            project,
                            "No spec files found in workspace",
                            "No Specs Found"
                        )
                        return@invokeLater
                    }

                    // Format the specs list
                    val specList = specs.map { specJson ->
                        val spec = specJson.asJsonObject
                        val name = spec.get("name").asString
                        val version = spec.get("version").asInt
                        val filePath = spec.get("filePath").asString
                        val specType = spec.get("specType").asString
                        val stability = spec.get("stability")?.asString ?: "unknown"

                        val fileName = filePath.substringAfterLast("/").substringAfterLast("\\")
                        "$specType: $name.v$version ($fileName) - $stability"
                    }.sorted()

                    val message = buildString {
                        append("Found ${specs.size()} spec file(s):\n\n")
                        specList.forEach { append("• $it\n") }
                    }

                    Messages.showInfoMessage(project, message, "ContractSpec Files")
                } else {
                    Messages.showErrorDialog(
                        project,
                        "Failed to list specs: ${response.error ?: "Unknown error"}",
                        "List Specs Error"
                    )
                }
            }
        }.exceptionally { throwable ->
            ApplicationManager.getApplication().invokeLater {
                Messages.showErrorDialog(
                    project,
                    "List specs error: ${throwable.message}",
                    "List Specs Error"
                )
            }
            null
        }
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}


