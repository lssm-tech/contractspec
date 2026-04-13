package tech.lssm.contractspec.bridge

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import com.intellij.openapi.diagnostic.Logger
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import java.util.concurrent.CompletableFuture

class NodeBridgeServiceImpl : NodeBridgeService {

    private val logger = Logger.getInstance(NodeBridgeServiceImpl::class.java)
    private val bridgeClient = JsonRpcBridgeClient(logger)

    override fun ensureBridgeRunning(): Boolean =
        bridgeClient.ensureStarted(resolveWorkspaceRoot())

    override fun stopBridge() {
        bridgeClient.stop()
    }

    override fun isBridgeRunning(): Boolean = bridgeClient.isRunning()

    override fun onProjectClosed(project: Project) {
        logger.debug("Project closed: ${project.name}")
        val remainingOpenProjects = ProjectManager.getInstance().openProjects
            .filter { !it.isDisposed && it !== project }
        if (remainingOpenProjects.isEmpty()) {
            stopBridge()
        }
    }

    override fun validateSpec(filePath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.VALIDATE_SPEC, jsonObject { addProperty("filePath", filePath) })

    override fun validateSpecs(filePaths: List<String>): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.VALIDATE_SPECS, jsonObject { add("filePaths", stringArray(filePaths)) })

    override fun listSpecs(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.LIST_SPECS)

    override fun buildSpec(filePath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.BUILD_SPEC, jsonObject { addProperty("filePath", filePath) })

    override fun syncSpecs(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.SYNC_SPECS)

    override fun watchSpecs(enabled: Boolean): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.WATCH_SPECS, jsonObject { addProperty("enabled", enabled) })

    override fun cleanGeneratedFiles(dryRun: Boolean): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.CLEAN_GENERATED_FILES, jsonObject { addProperty("dryRun", dryRun) })

    override fun analyzeDependencies(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.ANALYZE_DEPENDENCIES)

    override fun compareSpecs(leftPath: String, rightPath: String, semantic: Boolean): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.COMPARE_SPECS, jsonObject {
            addProperty("leftPath", leftPath)
            addProperty("rightPath", rightPath)
            addProperty("semantic", semantic)
        })

    override fun compareWithGit(filePath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.COMPARE_WITH_GIT, jsonObject { addProperty("filePath", filePath) })

    override fun analyzeIntegrity(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.ANALYZE_INTEGRITY)

    override fun exportToOpenApi(specPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.EXPORT_TO_OPENAPI, jsonObject { addProperty("specPath", specPath) })

    override fun importFromOpenApi(openApiPath: String, outputPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.IMPORT_FROM_OPENAPI, jsonObject {
            addProperty("openApiPath", openApiPath)
            addProperty("outputPath", outputPath)
        })

    override fun validateAgainstOpenApi(specPath: String, openApiPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.VALIDATE_AGAINST_OPENAPI, jsonObject {
            addProperty("specPath", specPath)
            addProperty("openApiPath", openApiPath)
        })

    override fun browseRegistry(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.BROWSE_REGISTRY)

    override fun searchRegistry(query: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.SEARCH_REGISTRY, jsonObject { addProperty("query", query) })

    override fun addFromRegistry(specId: String, outputPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.ADD_FROM_REGISTRY, jsonObject {
            addProperty("specId", specId)
            addProperty("outputPath", outputPath)
        })

    override fun browseExamples(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.BROWSE_EXAMPLES)

    override fun initExample(exampleId: String, outputPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.INIT_EXAMPLE, jsonObject {
            addProperty("exampleId", exampleId)
            addProperty("outputPath", outputPath)
        })

    override fun runSetupWizard(options: SetupWizardParams?): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.RUN_SETUP_WIZARD, setupWizardParams(options))

    override fun runQuickSetup(options: QuickSetupParams?): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.RUN_QUICK_SETUP, quickSetupParams(options))

    override fun runDoctorCheck(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.RUN_DOCTOR_CHECK)

    override fun getWorkspaceInfo(): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.GET_WORKSPACE_INFO)

    override fun exportForLLM(specPath: String, format: String?): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.EXPORT_FOR_LLM, jsonObject {
            addProperty("specPath", specPath)
            if (!format.isNullOrBlank()) {
                addProperty("format", format)
            }
        })

    override fun generateImplementationGuide(specPath: String): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.GENERATE_IMPLEMENTATION_GUIDE, jsonObject { addProperty("specPath", specPath) })

    override fun verifyImplementation(specPath: String, implementationPaths: List<String>): CompletableFuture<BridgeResponse> =
        request(BridgeProtocol.VERIFY_IMPLEMENTATION, jsonObject {
            addProperty("specPath", specPath)
            add("implementationPaths", stringArray(implementationPaths))
        })

    private fun request(method: String, params: JsonObject? = null): CompletableFuture<BridgeResponse> {
        if (!ensureBridgeRunning()) {
            return CompletableFuture.completedFuture(
                BridgeResponse(false, error = bridgeClient.getLastError() ?: "ContractSpec bridge is unavailable.")
            )
        }
        return bridgeClient.request(method, params)
    }

    private fun resolveWorkspaceRoot(): String? =
        ProjectManager.getInstance().openProjects
            .firstOrNull { !it.isDisposed && !it.basePath.isNullOrBlank() }
            ?.basePath

    private fun setupWizardParams(options: SetupWizardParams?): JsonObject? {
        if (options == null) {
            return null
        }

        return jsonObject {
            options.preset?.takeIf { it.isNotBlank() }?.let { addProperty("preset", it) }
            options.projectName?.takeIf { it.isNotBlank() }?.let { addProperty("projectName", it) }
            options.builderApiBaseUrl?.takeIf { it.isNotBlank() }?.let { addProperty("builderApiBaseUrl", it) }
            options.builderLocalRuntimeId?.takeIf { it.isNotBlank() }?.let { addProperty("builderLocalRuntimeId", it) }
            options.builderLocalGrantedTo?.takeIf { it.isNotBlank() }?.let { addProperty("builderLocalGrantedTo", it) }
        }.takeIf { it.size() > 0 }
    }

    private fun quickSetupParams(options: QuickSetupParams?): JsonObject? {
        if (options == null || options.preset.isNullOrBlank()) {
            return null
        }
        return jsonObject {
            addProperty("preset", options.preset)
        }
    }

    private fun jsonObject(builder: JsonObject.() -> Unit): JsonObject =
        JsonObject().apply(builder)

    private fun stringArray(values: List<String>): JsonArray =
        JsonArray().apply {
            values.forEach(::add)
        }
}
