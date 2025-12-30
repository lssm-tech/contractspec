package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import javax.swing.JLabel
import javax.swing.JPanel

/**
 * Build Results tool window showing build history.
 */
class BuildResultsToolWindow(private val project: Project) {

    fun createComponent(): JPanel {
        val panel = JPanel()
        panel.add(JLabel("Build Results - Coming Soon"))
        return panel
    }
}


