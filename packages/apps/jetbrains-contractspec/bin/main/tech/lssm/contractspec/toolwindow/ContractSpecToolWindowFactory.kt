package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.components.JBTabbedPane
import javax.swing.JComponent

/**
 * Factory for the main ContractSpec tool window with multiple tabs.
 */
class ContractSpecToolWindowFactory : ToolWindowFactory {

    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        val tabbedPane = JBTabbedPane()

        // Specs Explorer tab
        val specsExplorer = SpecsExplorerToolWindow(project)
        tabbedPane.addTab("Specs", specsExplorer.createComponent())

        // Dependencies tab
        val dependencies = DependenciesToolWindow(project)
        tabbedPane.addTab("Dependencies", dependencies.createComponent())

        // Build Results tab
        val buildResults = BuildResultsToolWindow(project)
        tabbedPane.addTab("Build Results", buildResults.createComponent())

        // Features tab
        val features = FeaturesToolWindow(project)
        tabbedPane.addTab("Features", features.createComponent())

        // Integrity tab
        val integrity = IntegrityToolWindow(project)
        tabbedPane.addTab("Integrity", integrity.createComponent())

        // LLM Tools tab
        val llmTools = LLMToolsToolWindow(project)
        tabbedPane.addTab("LLM Tools", llmTools.createComponent())

        val contentManager = toolWindow.contentManager
        val content = contentManager.factory.createContent(tabbedPane, "", false)
        contentManager.addContent(content)
    }

    override fun shouldBeAvailable(project: Project): Boolean {
        // Always available for now - could check for ContractSpec files in the future
        return true
    }
}


