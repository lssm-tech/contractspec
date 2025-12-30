package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

/**
 * Action to clean generated files with optional dry-run preview.
 */
class CleanAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Ask user if they want a dry run
        val result = Messages.showYesNoCancelDialog(
            project,
            "Do you want to preview what files would be removed (dry run) or actually remove them?",
            "Clean Generated Files",
            "Dry Run",
            "Remove Files",
            "Cancel",
            Messages.getQuestionIcon()
        )

        when (result) {
            Messages.YES -> performClean(project, dryRun = true)
            Messages.NO -> performClean(project, dryRun = false)
            else -> return // Cancel
        }
    }

    private fun performClean(project: Project, dryRun: Boolean) {
        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_clean", mapOf("dry_run" to dryRun.toString()))

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

        val action = if (dryRun) "Previewing files to remove..." else "Removing generated files..."

        // Run clean in background task
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Cleaning ContractSpec Files", true) {
            override fun run(indicator: ProgressIndicator) {
                indicator.isIndeterminate = true
                indicator.text = action

                try {
                    val cleanResult = bridgeService.cleanGeneratedFiles(dryRun).get()
                    if (!cleanResult.success) {
                        throw RuntimeException("Clean failed: ${cleanResult.error}")
                    }

                    val data = cleanResult.data
                    if (data == null) {
                        throw RuntimeException("No clean results received")
                    }

                    val filesRemoved = data.get("filesRemoved")?.asJsonArray?.map { it.asString } ?: emptyList()
                    val filesSkipped = data.get("filesSkipped")?.asJsonArray?.map { it.asString } ?: emptyList()
                    val isDryRun = data.get("dryRun")?.asBoolean ?: false

                    // Show results
                    ApplicationManager.getApplication().invokeLater {
                        val message = buildString {
                            if (isDryRun) {
                                append("🔍 Dry run completed\n\n")
                                append("Files that would be removed (${filesRemoved.size}):\n")
                                filesRemoved.forEach { append("• $it\n") }
                                if (filesSkipped.isNotEmpty()) {
                                    append("\nFiles that would be skipped (${filesSkipped.size}):\n")
                                    filesSkipped.forEach { append("• $it\n") }
                                }
                            } else {
                                append("🗑️ Clean completed\n\n")
                                append("Files removed (${filesRemoved.size}):\n")
                                filesRemoved.forEach { append("• $it\n") }
                                if (filesSkipped.isNotEmpty()) {
                                    append("\nFiles skipped (${filesSkipped.size}):\n")
                                    filesSkipped.forEach { append("• $it\n") }
                                }
                            }
                        }

                        val title = if (isDryRun) "Clean Preview" else "Clean Completed"

                        Messages.showInfoMessage(project, message, title)
                    }

                } catch (e: Exception) {
                    ApplicationManager.getApplication().invokeLater {
                        Messages.showErrorDialog(
                            project,
                            "Clean error: ${e.message}",
                            "Clean Error"
                        )
                    }
                }
            }
        })
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}


