package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages

open class UnavailableAction(
    private val featureName: String,
    private val detail: String
) : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        Messages.showInfoMessage(
            project,
            detail,
            "$featureName Unavailable"
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

class ExportToOpenApiAction : UnavailableAction(
    "OpenAPI export",
    "OpenAPI export is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class BrowseRegistryAction : UnavailableAction(
    "Registry browsing",
    "Registry browsing is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class AddFromRegistryAction : UnavailableAction(
    "Registry install",
    "Registry install is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class SearchRegistryAction : UnavailableAction(
    "Registry search",
    "Registry search is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class BrowseExamplesAction : UnavailableAction(
    "Examples browser",
    "Example browsing is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class InitExampleAction : UnavailableAction(
    "Example initialization",
    "Example initialization is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class SearchDocsAction : UnavailableAction(
    "Documentation search",
    "Docs search is not wired into the JetBrains UI yet. Configure `API Base URL` in settings and use the CLI or VS Code surface for now."
)

class LLMExportAction : UnavailableAction(
    "LLM export",
    "LLM export is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class LLMGuideAction : UnavailableAction(
    "Implementation guide",
    "Implementation guide generation is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class LLMVerifyAction : UnavailableAction(
    "Implementation verification",
    "Implementation verification is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class LLMCopyAction : UnavailableAction(
    "Copy for LLM",
    "Copy-for-LLM is not wired into the JetBrains UI yet. Use the CLI or VS Code surface for now."
)

class RefreshSpecsAction : UnavailableAction(
    "Specs refresh",
    "Use the refresh control inside the Specs tool window tab. A dedicated toolbar action is not wired yet."
)

class RefreshDepsAction : UnavailableAction(
    "Dependencies refresh",
    "Use the refresh control inside the Dependencies tool window tab. A dedicated toolbar action is not wired yet."
)

class ClearBuildResultsAction : UnavailableAction(
    "Build results clearing",
    "Build results history is still placeholder-only in the JetBrains UI, so there is nothing persistent to clear yet."
)

class RefreshIntegrityAction : UnavailableAction(
    "Integrity refresh",
    "Use `Analyze Integrity` from the ContractSpec menu. The Integrity tool window itself is still placeholder-only."
)

class RefreshLLMToolsAction : UnavailableAction(
    "LLM tools refresh",
    "The LLM tools panel is still placeholder-only in the JetBrains UI, so there is nothing to refresh yet."
)
