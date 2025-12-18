package tech.lssm.contractspec.settings

import com.intellij.openapi.options.Configurable
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBTextField
import javax.swing.JComponent
import javax.swing.JPanel
import javax.swing.JLabel

/**
 * Settings UI for ContractSpec plugin.
 * Simplified implementation for initial setup.
 */
class ContractSpecConfigurable : Configurable {

    private lateinit var apiBaseUrlField: JBTextField
    private lateinit var telemetryEnabledCheckBox: JBCheckBox

    override fun getDisplayName(): String = "ContractSpec"

    override fun createComponent(): JComponent? {
        apiBaseUrlField = JBTextField()
        telemetryEnabledCheckBox = JBCheckBox("Enable telemetry")

        // Simple settings panel
        val panel = JPanel()
        panel.layout = java.awt.GridLayout(2, 2, 5, 5)

        panel.add(JLabel("API Base URL:"))
        panel.add(apiBaseUrlField)
        panel.add(JLabel("Enable Telemetry:"))
        panel.add(telemetryEnabledCheckBox)

        return panel
    }

    override fun isModified(): Boolean {
        // Simplified - always return false for now
        return false
    }

    override fun apply() {
        // Apply settings - simplified for now
    }

    override fun reset() {
        // Reset settings - simplified for now
    }

    override fun disposeUIResources() {
        // Clean up resources if needed
    }
}
