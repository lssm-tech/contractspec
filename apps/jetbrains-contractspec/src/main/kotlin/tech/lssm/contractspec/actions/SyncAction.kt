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
 * Action to sync (validate and build) all specs in the workspace.
 */
class SyncAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_sync")

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

        // Run sync in background task
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Syncing ContractSpec Workspace", true) {
            override fun run(indicator: ProgressIndicator) {
                indicator.isIndeterminate = true
                indicator.text = "Syncing all specs..."

                try {
                    val syncResult = bridgeService.syncSpecs().get()
                    if (!syncResult.success) {
                        throw RuntimeException("Sync failed: ${syncResult.error}")
                    }

                    val data = syncResult.data
                    if (data == null) {
                        throw RuntimeException("No sync results received")
                    }

                    val specsProcessed = data.get("specsProcessed")?.asInt ?: 0
                    val specsBuilt = data.get("specsBuilt")?.asInt ?: 0
                    val specsFailed = data.get("specsFailed")?.asInt ?: 0
                    val errors = data.get("errors")?.asJsonArray?.map { it.asString } ?: emptyList()

                    // Show results
                    ApplicationManager.getApplication().invokeLater {
                        val message = buildString {
                            append("✅ Sync completed\n\n")
                            append("Specs processed: $specsProcessed\n")
                            append("Specs built: $specsBuilt\n")
                            append("Specs failed: $specsFailed\n")

                            if (errors.isNotEmpty()) {
                                append("\nErrors:\n")
                                errors.forEach { append("• $it\n") }
                            }
                        }

                        val title = if (specsFailed == 0) "Sync Successful" else "Sync Completed with Errors"

                        if (specsFailed == 0) {
                            Messages.showInfoMessage(project, message, title)
                        } else {
                            Messages.showWarningDialog(project, message, title)
                        }
                    }

                } catch (e: Exception) {
                    ApplicationManager.getApplication().invokeLater {
                        Messages.showErrorDialog(
                            project,
                            "Sync error: ${e.message}",
                            "Sync Error"
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


