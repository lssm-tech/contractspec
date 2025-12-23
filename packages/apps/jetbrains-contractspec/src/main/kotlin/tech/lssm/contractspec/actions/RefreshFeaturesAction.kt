package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages

/**
 * Action to refresh the Features tool window.
 */
class RefreshFeaturesAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // For now, just show a message that refresh is not implemented yet
        Messages.showInfoMessage(
            project,
            "Features view refresh - implementation coming soon",
            "Refresh Features"
        )
    }

    override fun update(e: AnActionEvent) {
        val project = e.project
        e.presentation.isEnabled = project != null
    }
}










