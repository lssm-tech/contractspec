package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.wm.ToolWindowManager
import com.intellij.ui.components.JBTabbedPane
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService
import tech.lssm.contractspec.toolwindow.DependenciesToolWindow

/**
 * Action to analyze spec dependencies and show dependency graph.
 *
 * Opens the ContractSpec tool window on the Dependencies tab and triggers a refresh.
 */
class AnalyzeDepsAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_analyze_deps")

        val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
        if (!bridgeService.ensureBridgeRunning()) {
            Messages.showErrorDialog(
                project,
                "Failed to start ContractSpec bridge server. Please check your Node.js installation.",
                "Bridge Server Error"
            )
            return
        }

        openDependenciesTab(project)
    }

    private fun openDependenciesTab(project: Project) {
        val toolWindow = ToolWindowManager.getInstance(project).getToolWindow("ContractSpec")
        if (toolWindow == null) {
            Messages.showWarningDialog(project, "ContractSpec tool window not found.", "Warning")
            return
        }

        toolWindow.show {
            val content = toolWindow.contentManager.contents.firstOrNull() ?: return@show
            val tabbedPane = content.component as? JBTabbedPane ?: return@show
            for (i in 0 until tabbedPane.tabCount) {
                if (tabbedPane.getTitleAt(i) == "Dependencies") {
                    tabbedPane.selectedIndex = i
                    break
                }
            }

            findDependenciesToolWindow(tabbedPane)?.refresh()
        }
    }

    /**
     * Find the DependenciesToolWindow instance backing the Dependencies tab.
     *
     * Since the tabbed pane stores JPanel components created by each tool window,
     * we trigger refresh via a static registry approach: the DependenciesToolWindow
     * stores a project-scoped instance that we can look up.
     */
    private fun findDependenciesToolWindow(tabbedPane: JBTabbedPane): DependenciesToolWindow? {
        return DependenciesToolWindow.getInstance(tabbedPane)
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}
