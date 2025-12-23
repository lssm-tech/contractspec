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
 * Action to validate all spec files in the workspace.
 */
class ValidateWorkspaceAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_validate_workspace")

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

        // Run validation in background task
        ProgressManager.getInstance().run(object : Task.Backgroundable(project, "Validating ContractSpec Workspace", true) {
            override fun run(indicator: ProgressIndicator) {
                indicator.isIndeterminate = true
                indicator.text = "Discovering spec files..."

                try {
                    // First, list all specs
                    val listResult = bridgeService.listSpecs().get()
                    if (!listResult.success) {
                        throw RuntimeException("Failed to list specs: ${listResult.error}")
                    }

                    val specs = listResult.data?.get("specs")?.asJsonArray
                    if (specs == null || specs.size() == 0) {
                        ApplicationManager.getApplication().invokeLater {
                            Messages.showInfoMessage(project, "No spec files found in workspace", "No Specs Found")
                        }
                        return
                    }

                    indicator.text = "Validating ${specs.size()} spec file(s)..."
                    indicator.isIndeterminate = false
                    indicator.fraction = 0.0

                    // Extract file paths
                    val filePaths = specs.map { it.asJsonObject.get("filePath").asString }

                    // Validate all specs
                    val validateResult = bridgeService.validateSpecs(filePaths).get()
                    if (!validateResult.success) {
                        throw RuntimeException("Validation failed: ${validateResult.error}")
                    }

                    val results = validateResult.data?.get("results")?.asJsonObject
                    if (results == null) {
                        throw RuntimeException("No validation results received")
                    }

                    // Process results
                    var passedCount = 0
                    var failedCount = 0
                    var totalWarnings = 0
                    val messages = mutableListOf<String>()

                    for ((filePath, resultJson) in results.entrySet()) {
                        val result = resultJson.asJsonObject
                        val valid = result.get("valid").asBoolean
                        val warnings = result.get("warnings")?.asJsonArray?.map { it.asString } ?: emptyList()
                        val errors = result.get("errors")?.asJsonArray?.map { it.asString } ?: emptyList()

                        val fileName = filePath.substringAfterLast("/").substringAfterLast("\\")
                        messages.add("$fileName: ${if (valid) "✅" else "❌"}")

                        if (valid) {
                            passedCount++
                            if (warnings.isNotEmpty()) {
                                totalWarnings += warnings.size
                                warnings.forEach { messages.add("   ⚠️  $it") }
                            }
                        } else {
                            failedCount++
                            errors.forEach { messages.add("   ❌ $it") }
                            if (warnings.isNotEmpty()) {
                                totalWarnings += warnings.size
                                warnings.forEach { messages.add("   ⚠️  $it") }
                            }
                        }

                        indicator.fraction = (passedCount + failedCount).toDouble() / filePaths.size
                    }

                    // Show results
                    ApplicationManager.getApplication().invokeLater {
                        val summary = """
                            === Validation Summary ===
                            Passed: $passedCount
                            Failed: $failedCount
                            Warnings: $totalWarnings
                        """.trimIndent()

                        val fullMessage = (listOf(summary) + messages).joinToString("\n")

                        if (failedCount == 0) {
                            Messages.showInfoMessage(
                                project,
                                fullMessage,
                                "✅ All Specs Passed Validation"
                            )
                        } else {
                            Messages.showErrorDialog(
                                project,
                                fullMessage,
                                "❌ Validation Failed"
                            )
                        }
                    }

                } catch (e: Exception) {
                    ApplicationManager.getApplication().invokeLater {
                        Messages.showErrorDialog(
                            project,
                            "Validation error: ${e.message}",
                            "Validation Error"
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


