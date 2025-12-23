package tech.lssm.contractspec.bridge

import com.google.gson.JsonObject
import com.intellij.openapi.project.Project
import java.io.File
import java.util.concurrent.CompletableFuture

/**
 * Service for communicating with the Node.js bridge server.
 *
 * Manages the lifecycle of the Node.js subprocess and provides
 * typed methods for calling ContractSpec workspace services.
 */
interface NodeBridgeService {

    /**
     * Ensure the bridge server is running.
     */
    fun ensureBridgeRunning(): Boolean

    /**
     * Stop the bridge server.
     */
    fun stopBridge()

    /**
     * Check if the bridge server is running.
     */
    fun isBridgeRunning(): Boolean

    /**
     * Called when a project is closed to clean up resources.
     */
    fun onProjectClosed(project: Project)

    // Validation methods
    fun validateSpec(filePath: String): CompletableFuture<BridgeResponse>

    fun validateSpecs(filePaths: List<String>): CompletableFuture<BridgeResponse>

    fun listSpecs(): CompletableFuture<BridgeResponse>

    // Build methods
    fun buildSpec(filePath: String): CompletableFuture<BridgeResponse>

    fun syncSpecs(): CompletableFuture<BridgeResponse>

    fun watchSpecs(enabled: Boolean): CompletableFuture<BridgeResponse>

    fun cleanGeneratedFiles(dryRun: Boolean = false): CompletableFuture<BridgeResponse>

    // Analysis methods
    fun analyzeDependencies(): CompletableFuture<BridgeResponse>

    fun compareSpecs(leftPath: String, rightPath: String, semantic: Boolean = true): CompletableFuture<BridgeResponse>

    fun compareWithGit(filePath: String): CompletableFuture<BridgeResponse>

    fun analyzeIntegrity(): CompletableFuture<BridgeResponse>

    // OpenAPI methods
    fun exportToOpenApi(specPath: String): CompletableFuture<BridgeResponse>

    fun importFromOpenApi(openApiPath: String, outputPath: String): CompletableFuture<BridgeResponse>

    fun validateAgainstOpenApi(specPath: String, openApiPath: String): CompletableFuture<BridgeResponse>

    // Registry methods
    fun browseRegistry(): CompletableFuture<BridgeResponse>

    fun searchRegistry(query: String): CompletableFuture<BridgeResponse>

    fun addFromRegistry(specId: String, outputPath: String): CompletableFuture<BridgeResponse>

    // Examples methods
    fun browseExamples(): CompletableFuture<BridgeResponse>

    fun initExample(exampleId: String, outputPath: String): CompletableFuture<BridgeResponse>

    // Setup methods
    fun runSetupWizard(): CompletableFuture<BridgeResponse>

    fun runQuickSetup(): CompletableFuture<BridgeResponse>

    fun runDoctorCheck(): CompletableFuture<BridgeResponse>

    // Workspace methods
    fun getWorkspaceInfo(): CompletableFuture<BridgeResponse>

    // LLM methods
    fun exportForLLM(specPath: String, format: String? = null): CompletableFuture<BridgeResponse>

    fun generateImplementationGuide(specPath: String): CompletableFuture<BridgeResponse>

    fun verifyImplementation(specPath: String, implementationPaths: List<String>): CompletableFuture<BridgeResponse>
}

/**
 * Response from bridge operations.
 */
data class BridgeResponse(
    val success: Boolean,
    val data: JsonObject? = null,
    val error: String? = null
)


