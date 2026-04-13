package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import tech.lssm.contractspec.bridge.BridgeResponse
import tech.lssm.contractspec.bridge.QuickSetupParams
import tech.lssm.contractspec.bridge.SetupWizardParams

class SetupAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val options = promptForSetupWizardParams(project) ?: return
        trackEvent("jetbrains_action_setup")
        runBackgroundBridgeAction(
            project = project,
            taskTitle = "Running ContractSpec setup",
            request = {
                getBridgeService(project)?.runSetupWizard(options)?.get()
                    ?: BridgeResponse(false, error = "ContractSpec bridge is unavailable.")
            },
            formatter = { response ->
                formatSetupMessage("Setup completed.", response.data)
            }
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

class QuickSetupAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val options = promptForQuickSetupParams(project) ?: return
        trackEvent("jetbrains_action_quick_setup")
        runBackgroundBridgeAction(
            project = project,
            taskTitle = "Running ContractSpec quick setup",
            request = {
                getBridgeService(project)?.runQuickSetup(options)?.get()
                    ?: BridgeResponse(false, error = "ContractSpec bridge is unavailable.")
            },
            formatter = { response ->
                formatSetupMessage("Quick setup completed.", response.data)
            }
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

class DoctorAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        trackEvent("jetbrains_action_doctor")
        runBackgroundBridgeAction(
            project = project,
            taskTitle = "Running ContractSpec doctor",
            request = {
                getBridgeService(project)?.runDoctorCheck()?.get()
                    ?: BridgeResponse(false, error = "ContractSpec bridge is unavailable.")
            },
            formatter = { response ->
                formatDoctorMessage(response.data)
            }
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

class WorkspaceInfoAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        trackEvent("jetbrains_action_workspace_info")
        runBackgroundBridgeAction(
            project = project,
            taskTitle = "Loading ContractSpec workspace info",
            request = {
                getBridgeService(project)?.getWorkspaceInfo()?.get()
                    ?: BridgeResponse(false, error = "ContractSpec bridge is unavailable.")
            },
            formatter = { response ->
                formatWorkspaceInfoMessage(response.data)
            }
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}

class AnalyzeIntegrityAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        trackEvent("jetbrains_action_analyze_integrity")
        runBackgroundBridgeAction(
            project = project,
            taskTitle = "Analyzing ContractSpec integrity",
            request = {
                getBridgeService(project)?.analyzeIntegrity()?.get()
                    ?: BridgeResponse(false, error = "ContractSpec bridge is unavailable.")
            },
            formatter = { response ->
                formatIntegrityMessage(response.data)
            }
        )
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}
