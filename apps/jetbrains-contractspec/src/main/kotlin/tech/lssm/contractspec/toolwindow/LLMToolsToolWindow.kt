package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import javax.swing.JLabel
import javax.swing.JPanel

/**
 * LLM Tools tool window for AI-assisted development.
 */
class LLMToolsToolWindow(private val project: Project) {

    fun createComponent(): JPanel {
        val panel = JPanel()
        panel.add(JLabel("LLM Tools - Coming Soon"))
        return panel
    }
}


