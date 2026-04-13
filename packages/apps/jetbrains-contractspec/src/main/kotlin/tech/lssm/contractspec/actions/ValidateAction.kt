package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.vfs.VirtualFile
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService
import tech.lssm.contractspec.util.SpecFileUtil

/**
 * Action to validate the current spec file.
 */
class ValidateAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: return

        // Check if it's a spec file
        if (!SpecFileUtil.isSpecFile(virtualFile)) {
            Messages.showWarningDialog(
                project,
                "Current file is not a ContractSpec file. Expected extensions: .contracts.ts, .event.ts, .presentation.ts, etc.",
                "Not a Spec File"
            )
            return
        }

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_validate")

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

        // Show progress
        val filePath = virtualFile.path
        val fileName = virtualFile.name

        ApplicationManager.getApplication().invokeLater {
            Messages.showInfoMessage(
                project,
                "Validating: $fileName",
                "Validation Started"
            )
        }

        // Perform validation asynchronously
        bridgeService.validateSpec(filePath).thenAccept { response ->
            ApplicationManager.getApplication().invokeLater {
                if (response.success && response.data != null) {
                    val results = response.data.get("results")?.asJsonArray
                    if (results == null) {
                        Messages.showErrorDialog(
                            project,
                            "Validation failed: No results received",
                            "Validation Error"
                        )
                        return@invokeLater
                    }
                    val failed = results.filter { !it.asJsonObject.get("valid").asBoolean }
                    val warnings = results.flatMap {
                        it.asJsonObject.get("warnings")?.asJsonArray?.map { warning -> warning.asString } ?: emptyList()
                    }

                    if (failed.isEmpty()) {
                        val message = buildString {
                            append("✅ Spec validation passed: $fileName (${results.size()} spec(s))")
                            if (warnings.isNotEmpty()) {
                                append("\n\nWarnings (${warnings.size}):")
                                warnings.forEach { append("\n  ⚠️  $it") }
                            }
                        }
                        Messages.showInfoMessage(project, message, "Validation Passed")
                    } else {
                        val message = buildString {
                            append("❌ Spec validation failed: ${failed.size} spec(s) with errors")
                            append("\n\nErrors:")
                            failed.forEach { item ->
                                val result = item.asJsonObject
                                val spec = result.get("spec").asJsonObject
                                val exportName = spec.get("exportName")?.asString
                                val declarationLine = spec.get("declarationLine")?.asInt
                                append("\n")
                                append("\n  ")
                                append(exportName ?: fileName)
                                if (declarationLine != null) {
                                    append(":$declarationLine")
                                }
                                result.get("errors")?.asJsonArray?.forEach { error ->
                                    append("\n    ❌ ${error.asString}")
                                }
                                result.get("warnings")?.asJsonArray?.forEach { warning ->
                                    append("\n    ⚠️  ${warning.asString}")
                                }
                            }
                        }
                        Messages.showErrorDialog(project, message, "Validation Failed")
                    }
                } else {
                    Messages.showErrorDialog(
                        project,
                        "Validation failed: ${response.error ?: "Unknown error"}",
                        "Validation Error"
                    )
                }
            }
        }.exceptionally { throwable ->
            ApplicationManager.getApplication().invokeLater {
                Messages.showErrorDialog(
                    project,
                    "Validation error: ${throwable.message}",
                    "Validation Error"
                )
            }
            null
        }
    }

    override fun update(e: AnActionEvent) {
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE)
        e.presentation.isEnabled = virtualFile != null && SpecFileUtil.isSpecFile(virtualFile)
    }
}

