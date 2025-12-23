package tech.lssm.contractspec

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.project.ProjectManagerListener
import com.intellij.openapi.startup.ProjectActivity
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.telemetry.TelemetryService

/**
 * Main plugin class for ContractSpec JetBrains Plugin.
 *
 * Handles plugin lifecycle, initialization, and coordination between components.
 */
class ContractSpecPlugin : ProjectActivity {

    override suspend fun execute(project: Project) {
        // Initialize plugin for this project
        initializePluginForProject(project)
    }

    private fun initializePluginForProject(project: Project) {
        // Get services
        val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
        val telemetryService = ApplicationManager.getApplication().getService(TelemetryService::class.java)

        // Initialize telemetry
        telemetryService?.initialize()

        // Send activation event
        telemetryService?.trackEvent("jetbrains_plugin_activated", mapOf(
            "project_name" to (project.name.takeIf { it.isNotBlank() } ?: "unnamed"),
            "ide_version" to getIdeVersion(),
            "plugin_version" to getPluginVersion()
        ))

        // Start bridge service if not already started
        bridgeService?.ensureBridgeRunning()

        // Register project-specific listeners
        registerProjectListeners(project)
    }

    private fun registerProjectListeners(project: Project) {
        // Add project close listener to clean up resources
        project.messageBus.connect().subscribe(ProjectManager.TOPIC, object : ProjectManagerListener {
            override fun projectClosed(project: Project) {
                // Clean up project-specific resources
                val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
                bridgeService?.onProjectClosed(project)
            }
        })
    }

    private fun getIdeVersion(): String {
        return com.intellij.openapi.application.ApplicationInfo.getInstance().build.toString()
    }

    private fun getPluginVersion(): String {
        // Get version from plugin.xml or resources
        return try {
            val pluginClass = this::class.java
            val pluginXml = pluginClass.classLoader.getResource("META-INF/plugin.xml")
            // Simple version extraction - in real implementation, parse XML properly
            "0.0.1"
        } catch (e: Exception) {
            "unknown"
        }
    }
}


