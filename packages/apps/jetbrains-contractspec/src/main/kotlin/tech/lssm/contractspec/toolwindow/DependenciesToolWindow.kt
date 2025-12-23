package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import javax.swing.JLabel
import javax.swing.JPanel

/**
 * Dependencies tool window showing spec dependency graph.
 */
class DependenciesToolWindow(private val project: Project) {

    fun createComponent(): JPanel {
        val panel = JPanel()
        panel.add(JLabel("Dependencies View - Coming Soon"))
        return panel
    }
}


