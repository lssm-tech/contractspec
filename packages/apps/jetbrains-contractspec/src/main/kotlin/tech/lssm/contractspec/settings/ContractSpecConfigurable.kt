package tech.lssm.contractspec.settings

import com.intellij.openapi.options.Configurable
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBTextField
import com.intellij.util.ui.FormBuilder
import tech.lssm.contractspec.util.SpecFileUtil
import javax.swing.JComboBox
import javax.swing.JComponent
import javax.swing.JPanel

class ContractSpecConfigurable : Configurable {

    private val settings = ContractSpecSettings.getInstance()

    private var panel: JPanel? = null
    private lateinit var apiBaseUrlField: JBTextField
    private lateinit var registryBaseUrlField: JBTextField
    private lateinit var posthogHostField: JBTextField
    private lateinit var posthogProjectKeyField: JBTextField
    private lateinit var validationOnSaveCheckBox: JBCheckBox
    private lateinit var validationOnOpenCheckBox: JBCheckBox
    private lateinit var telemetryEnabledCheckBox: JBCheckBox
    private lateinit var specsGroupingModeCombo: JComboBox<String>

    override fun getDisplayName(): String = "ContractSpec"

    override fun createComponent(): JComponent {
        if (panel == null) {
            apiBaseUrlField = JBTextField()
            registryBaseUrlField = JBTextField()
            posthogHostField = JBTextField()
            posthogProjectKeyField = JBTextField()
            validationOnSaveCheckBox = JBCheckBox("Validate ContractSpec files on save")
            validationOnOpenCheckBox = JBCheckBox("Validate ContractSpec files on open")
            telemetryEnabledCheckBox = JBCheckBox("Enable ContractSpec telemetry")
            specsGroupingModeCombo = JComboBox(SpecFileUtil.getGroupingModes().keys.toTypedArray())
            specsGroupingModeCombo.toolTipText = "Controls how specs are grouped in the ContractSpec explorer."

            panel = FormBuilder.createFormBuilder()
                .addLabeledComponent("API Base URL:", apiBaseUrlField, 1, false)
                .addLabeledComponent("Registry Base URL:", registryBaseUrlField, 1, false)
                .addSeparator()
                .addComponent(validationOnSaveCheckBox)
                .addComponent(validationOnOpenCheckBox)
                .addLabeledComponent("Explorer Grouping:", specsGroupingModeCombo, 1, false)
                .addSeparator()
                .addComponent(telemetryEnabledCheckBox)
                .addLabeledComponent("PostHog Host:", posthogHostField, 1, false)
                .addLabeledComponent("PostHog Project Key:", posthogProjectKeyField, 1, false)
                .panel

            reset()
        }

        return panel!!
    }

    override fun isModified(): Boolean {
        return apiBaseUrlField.text.trim() != settings.apiBaseUrl ||
            registryBaseUrlField.text.trim() != settings.registryBaseUrl ||
            posthogHostField.text.trim() != settings.posthogHost ||
            posthogProjectKeyField.text.trim() != settings.posthogProjectKey ||
            validationOnSaveCheckBox.isSelected != settings.validationOnSave ||
            validationOnOpenCheckBox.isSelected != settings.validationOnOpen ||
            telemetryEnabledCheckBox.isSelected != settings.telemetryEnabled ||
            (specsGroupingModeCombo.selectedItem as? String ?: "type") != settings.specsGroupingMode
    }

    override fun apply() {
        settings.apiBaseUrl = apiBaseUrlField.text.trim()
        settings.registryBaseUrl = registryBaseUrlField.text.trim()
        settings.posthogHost = posthogHostField.text.trim()
        settings.posthogProjectKey = posthogProjectKeyField.text.trim()
        settings.validationOnSave = validationOnSaveCheckBox.isSelected
        settings.validationOnOpen = validationOnOpenCheckBox.isSelected
        settings.telemetryEnabled = telemetryEnabledCheckBox.isSelected
        settings.specsGroupingMode = specsGroupingModeCombo.selectedItem as? String ?: "type"
    }

    override fun reset() {
        apiBaseUrlField.text = settings.apiBaseUrl
        registryBaseUrlField.text = settings.registryBaseUrl
        posthogHostField.text = settings.posthogHost
        posthogProjectKeyField.text = settings.posthogProjectKey
        validationOnSaveCheckBox.isSelected = settings.validationOnSave
        validationOnOpenCheckBox.isSelected = settings.validationOnOpen
        telemetryEnabledCheckBox.isSelected = settings.telemetryEnabled
        specsGroupingModeCombo.selectedItem = settings.specsGroupingMode
    }

    override fun disposeUIResources() {
        panel = null
    }
}
