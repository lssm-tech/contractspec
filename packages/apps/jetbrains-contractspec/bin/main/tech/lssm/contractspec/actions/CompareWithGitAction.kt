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
 * Action to compare spec file with git baseline version.
 */
class CompareWithGitAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE) ?: return

        if (!SpecFileUtil.isSpecFile(virtualFile)) {
            Messages.showWarningDialog(
                project,
                "Current file is not a ContractSpec file.",
                "Not a Spec File"
            )
            return
        }

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_compare_git")

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

        val filePath = virtualFile.path
        val fileName = virtualFile.name

        ApplicationManager.getApplication().invokeLater {
            Messages.showInfoMessage(
                project,
                "Comparing $fileName with git baseline...",
                "Git Comparison Started"
            )
        }

        // Perform git comparison asynchronously
        bridgeService.compareWithGit(filePath).thenAccept { response ->
            ApplicationManager.getApplication().invokeLater {
                if (response.success && response.data != null) {
                    val hasChanges = response.data.get("hasChanges")?.asBoolean ?: false
                    val gitDiff = response.data.get("gitDiff")?.asString
                    val semanticDiff = response.data.get("semanticDiff")

                    if (hasChanges) {
                        val message = buildString {
                            append("🔄 Changes detected in $fileName\n\n")
                            if (gitDiff != null && gitDiff.isNotBlank()) {
                                append("Git Diff:\n$gitDiff\n\n")
                            }
                            if (semanticDiff != null) {
                                append("Semantic Changes:\n")
                                val identical = semanticDiff.asJsonObject.get("identical")?.asBoolean ?: true
                                if (!identical) {
                                    val differences = semanticDiff.asJsonObject.get("differences")?.asJsonArray?.map { it.asString } ?: emptyList()
                                    differences.forEach { append("• $it\n") }
                                }
                            }
                        }
                        Messages.showInfoMessage(project, message, "Git Comparison Results")
                    } else {
                        Messages.showInfoMessage(
                            project,
                            "✅ No changes detected in $fileName compared to git baseline.",
                            "No Changes"
                        )
                    }
                } else {
                    Messages.showErrorDialog(
                        project,
                        "Git comparison failed: ${response.error ?: "Unknown error"}",
                        "Git Comparison Error"
                    )
                }
            }
        }.exceptionally { throwable ->
            ApplicationManager.getApplication().invokeLater {
                Messages.showErrorDialog(
                    project,
                    "Git comparison error: ${throwable.message}",
                    "Git Comparison Error"
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


