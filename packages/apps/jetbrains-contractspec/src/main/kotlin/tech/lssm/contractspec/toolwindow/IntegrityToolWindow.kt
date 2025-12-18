package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import javax.swing.JLabel
import javax.swing.JPanel

/**
 * Integrity Analysis tool window showing contract integrity.
 */
class IntegrityToolWindow(private val project: Project) {

    fun createComponent(): JPanel {
        val panel = JPanel()
        panel.add(JLabel("Integrity Analysis - Coming Soon"))
        return panel
    }
}


