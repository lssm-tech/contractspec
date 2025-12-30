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
 * Action to compare two spec files (semantic or text diff).
 */
class CompareSpecsAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // For now, show a message asking user to select files
        // In a real implementation, this would show a file chooser dialog
        Messages.showInfoMessage(
            project,
            "Spec comparison feature coming soon!\n\nThis will allow you to compare two spec files with semantic diffing that understands ContractSpec structure.",
            "Compare Specs"
        )

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_compare_specs")
    }

    override fun update(e: AnActionEvent) {
        val virtualFile = e.getData(CommonDataKeys.VIRTUAL_FILE)
        e.presentation.isEnabled = virtualFile != null && SpecFileUtil.isSpecFile(virtualFile)
    }
}


