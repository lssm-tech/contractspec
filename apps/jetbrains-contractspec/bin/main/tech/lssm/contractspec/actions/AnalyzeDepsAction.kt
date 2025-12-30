package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.Messages
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

/**
 * Action to analyze spec dependencies and show dependency graph.
 */
class AnalyzeDepsAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_analyze_deps")

        // Get bridge service
        val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
        if (!bridgeService.ensureBridgeRunning()) {
            Messages.showErrorDialog(
                project,
                "Failed to start ContractSpec bridge server. Please check your Node.js installation.",
                "Bridge Server Error"
            )
            return
        }

        // Run dependency analysis in background task
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Analyzing ContractSpec Dependencies", true) {
            override fun run(indicator: ProgressIndicator) {
                indicator.isIndeterminate = true
                indicator.text = "Analyzing spec dependencies..."

                try {
                    val depsResult = bridgeService.analyzeDependencies().get()
                    if (!depsResult.success) {
                        throw RuntimeException("Dependency analysis failed: ${depsResult.error}")
                    }

                    val data = depsResult.data
                    if (data == null) {
                        throw RuntimeException("No dependency analysis results received")
                    }

                    val dependencies = data.get("dependencies")?.asJsonObject
                    val circularDeps = data.get("circularDeps")?.asJsonArray?.map { depArray ->
                        depArray.asJsonArray.map { it.asString }
                    } ?: emptyList()

                    // Show results
                    ApplicationManager.getApplication().invokeLater {
                        val message = buildString {
                            append("📊 Dependency Analysis Results\n\n")

                            if (dependencies != null && dependencies.size() > 0) {
                                append("Dependencies found (${dependencies.size()} specs with dependencies):\n")
                                for ((spec, deps) in dependencies.entrySet()) {
                                    val depsList = deps.asJsonArray.map { it.asString }
                                    append("• $spec → ${depsList.joinToString(", ")}\n")
                                }
                            } else {
                                append("No dependencies found.\n")
                            }

                            if (circularDeps.isNotEmpty()) {
                                append("\n⚠️ Circular dependencies detected:\n")
                                circularDeps.forEach { cycle ->
                                    append("• ${cycle.joinToString(" → ")} → ${cycle.first()}\n")
                                }
                            }
                        }

                        Messages.showInfoMessage(project, message, "Dependency Analysis")

                        // TODO: In a real implementation, this would open a specialized tool window
                        // showing the dependency graph visually, rather than just showing a message.
                    }

                } catch (e: Exception) {
                    ApplicationManager.getApplication().invokeLater {
                        Messages.showErrorDialog(
                            project,
                            "Dependency analysis error: ${e.message}",
                            "Analysis Error"
                        )
                    }
                }
            }
        })
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }
}


