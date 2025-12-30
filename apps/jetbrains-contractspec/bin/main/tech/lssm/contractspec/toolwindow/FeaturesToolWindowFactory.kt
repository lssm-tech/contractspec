package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory

/**
 * Factory for the standalone Features tool window.
 * Shows feature -> spec relationships with navigation.
 */
class FeaturesToolWindowFactory : ToolWindowFactory {

    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        val featuresToolWindow = FeaturesToolWindow(project)
        val contentManager = toolWindow.contentManager
        val content = contentManager.factory.createContent(
            featuresToolWindow.createComponent(),
            "",
            false
        )
        contentManager.addContent(content)
    }

    override fun shouldBeAvailable(project: Project): Boolean {
        return true
    }
}


