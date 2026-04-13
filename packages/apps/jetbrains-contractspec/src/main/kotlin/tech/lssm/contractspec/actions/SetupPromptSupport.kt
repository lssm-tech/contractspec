package tech.lssm.contractspec.actions

import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.QuickSetupParams
import tech.lssm.contractspec.bridge.SetupWizardParams
import tech.lssm.contractspec.settings.ContractSpecSettings

private val setupPresets = linkedMapOf(
    "core" to "Core workspace only",
    "connect" to "Connect workspace",
    "builder-managed" to "Builder managed runtime",
    "builder-local" to "Builder local runtime",
    "builder-hybrid" to "Builder hybrid runtime"
)

internal fun promptForSetupWizardParams(project: Project): SetupWizardParams? {
    val preset = promptForPreset(
        project = project,
        title = "Setup ContractSpec",
        message = "Choose the initialization preset for this workspace:"
    ) ?: return null

    val defaultProjectName = project.name.takeIf { it.isNotBlank() }.orEmpty()
    val projectName = promptForOptionalValue(
        project = project,
        title = "Setup ContractSpec",
        message = "Project name (optional):",
        initialValue = defaultProjectName
    ) ?: return null

    val settings = ContractSpecSettings.getInstance()
    val needsBuilderApi = preset == "builder-managed" || preset == "builder-hybrid"
    val needsLocalRuntime = preset == "builder-local" || preset == "builder-hybrid"

    val builderApiBaseUrl = if (needsBuilderApi) {
        promptForOptionalValue(
            project = project,
            title = "Setup ContractSpec",
            message = "Builder API base URL (optional):",
            initialValue = settings.apiBaseUrl
        ) ?: return null
    } else null

    val builderLocalRuntimeId = if (needsLocalRuntime) {
        promptForOptionalValue(
            project = project,
            title = "Setup ContractSpec",
            message = "Builder local runtime ID (optional):",
            initialValue = ""
        ) ?: return null
    } else null

    val builderLocalGrantedTo = if (needsLocalRuntime) {
        promptForOptionalValue(
            project = project,
            title = "Setup ContractSpec",
            message = "Builder local runtime granted-to (optional):",
            initialValue = ""
        ) ?: return null
    } else null

    return SetupWizardParams(
        preset = preset,
        projectName = projectName,
        builderApiBaseUrl = builderApiBaseUrl,
        builderLocalRuntimeId = builderLocalRuntimeId,
        builderLocalGrantedTo = builderLocalGrantedTo
    )
}

internal fun promptForQuickSetupParams(project: Project): QuickSetupParams? {
    val preset = promptForPreset(
        project = project,
        title = "Quick Setup ContractSpec",
        message = "Choose the quick-setup preset:"
    ) ?: return null
    return QuickSetupParams(preset = preset)
}

private fun promptForPreset(project: Project, title: String, message: String): String? {
    val labels = setupPresets.map { (key, value) -> "$key — $value" }.toTypedArray()
    val selected = Messages.showEditableChooseDialog(
        message,
        title,
        Messages.getQuestionIcon(),
        labels,
        labels.first(),
        null
    ) ?: return null

    return labels.indexOf(selected)
        .takeIf { it >= 0 }
        ?.let { setupPresets.keys.elementAt(it) }
}

private fun promptForOptionalValue(
    project: Project,
    title: String,
    message: String,
    initialValue: String
): String? {
    val value = Messages.showInputDialog(
        project,
        message,
        title,
        Messages.getQuestionIcon(),
        initialValue,
        null
    ) ?: return null

    return value.trim().ifBlank { null }
}
