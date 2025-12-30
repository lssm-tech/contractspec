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
 * Action to build/scaffold from the current spec file.
 */
class BuildAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: return

        // Check if it's a spec file that can be built
        if (!SpecFileUtil.isSpecFile(virtualFile)) {
            Messages.showWarningDialog(
                project,
                "Current file is not a ContractSpec file. Expected extensions: .contracts.ts, .event.ts, .presentation.ts, etc.",
                "Not a Spec File"
            )
            return
        }

        val specType = SpecFileUtil.getSpecType(virtualFile.path)
        if (specType != "operation" && specType != "presentation") {
            Messages.showWarningDialog(
                project,
                "Build action is only available for operation (.contracts.ts) and presentation (.presentation.ts) specs.",
                "Build Not Supported"
            )
            return
        }

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_build")

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
                "Building/scaffolding from: $fileName",
                "Build Started"
            )
        }

        // Perform build asynchronously
        bridgeService.buildSpec(filePath).thenAccept { response ->
            ApplicationManager.getApplication().invokeLater {
                if (response.success && response.data != null) {
                    val success = response.data.get("success")?.asBoolean ?: false
                    val outputPath = response.data.get("outputPath")?.asString
                    val artifacts = response.data.get("artifacts")?.asJsonArray?.map { it.asString } ?: emptyList()
                    val errors = response.data.get("errors")?.asJsonArray?.map { it.asString } ?: emptyList()

                    if (success) {
                        val message = buildString {
                            append("✅ Build successful: $fileName")
                            if (outputPath != null) {
                                append("\n\nOutput: $outputPath")
                            }
                            if (artifacts.isNotEmpty()) {
                                append("\n\nGenerated artifacts:")
                                artifacts.forEach { append("\n  📄 $it") }
                            }
                        }
                        Messages.showInfoMessage(project, message, "Build Successful")
                    } else {
                        val message = buildString {
                            append("❌ Build failed")
                            if (errors.isNotEmpty()) {
                                append("\n\nErrors:")
                                errors.forEach { append("\n  ❌ $it") }
                            }
                        }
                        Messages.showErrorDialog(project, message, "Build Failed")
                    }
                } else {
                    Messages.showErrorDialog(
                        project,
                        "Build failed: ${response.error ?: "Unknown error"}",
                        "Build Error"
                    )
                }
            }
        }.exceptionally { throwable ->
            ApplicationManager.getApplication().invokeLater {
                Messages.showErrorDialog(
                    project,
                    "Build error: ${throwable.message}",
                    "Build Error"
                )
            }
            null
        }
    }

    override fun update(e: AnActionEvent) {
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE)
        if (virtualFile != null && SpecFileUtil.isSpecFile(virtualFile)) {
            val specType = SpecFileUtil.getSpecType(virtualFile.path)
            e.presentation.isEnabled = specType == "operation" || specType == "presentation"
        } else {
            e.presentation.isEnabled = false
        }
    }
}


