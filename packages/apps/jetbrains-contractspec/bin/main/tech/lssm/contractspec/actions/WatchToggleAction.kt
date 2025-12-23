package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.Presentation
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

/**
 * Action to toggle watch mode for automatic spec rebuilding.
 */
class WatchToggleAction : AnAction() {

    companion object {
        private var watchEnabled = false
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_watch_toggle", mapOf("enabled" to (!watchEnabled).toString()))

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

        val newState = !watchEnabled

        // Toggle watch mode
        bridgeService.watchSpecs(newState).thenAccept { response ->
            ApplicationManager.getApplication().invokeLater {
                if (response.success) {
                    watchEnabled = newState
                    val status = if (newState) "enabled" else "disabled"
                    Messages.showInfoMessage(
                        project,
                        "Watch mode $status. Specs will ${if (newState) "now" else "no longer"} be automatically rebuilt on changes.",
                        "Watch Mode ${status.capitalize()}"
                    )

                    // Update status bar if available
                    e.presentation.text = getActionText()
                    e.presentation.description = getActionDescription()
                } else {
                    Messages.showErrorDialog(
                        project,
                        "Failed to toggle watch mode: ${response.error ?: "Unknown error"}",
                        "Watch Mode Error"
                    )
                }
            }
        }.exceptionally { throwable ->
            ApplicationManager.getApplication().invokeLater {
                Messages.showErrorDialog(
                    project,
                    "Watch toggle error: ${throwable.message}",
                    "Watch Mode Error"
                )
            }
            null
        }
    }

    override fun update(e: AnActionEvent) {
        e.presentation.text = getActionText()
        e.presentation.description = getActionDescription()
        e.presentation.isEnabled = e.project != null
    }

    private fun getActionText(): String {
        return if (watchEnabled) "Disable Watch Mode" else "Enable Watch Mode"
    }

    private fun getActionDescription(): String {
        return if (watchEnabled) "Disable automatic spec rebuilding on file changes" else "Enable automatic spec rebuilding on file changes"
    }
}


