package tech.lssm.contractspec.bridge

import com.google.gson.JsonObject
import com.google.gson.annotations.SerializedName

/**
 * JSON-RPC protocol definitions for bridge communication.
 */
object BridgeProtocol {

    // Method names
    const val VALIDATE_SPEC = "contractspec/validateSpec"
    const val VALIDATE_SPECS = "contractspec/validateSpecs"
    const val LIST_SPECS = "contractspec/listSpecs"
    const val BUILD_SPEC = "contractspec/buildSpec"
    const val SYNC_SPECS = "contractspec/syncSpecs"
    const val WATCH_SPECS = "contractspec/watchSpecs"
    const val CLEAN_GENERATED_FILES = "contractspec/cleanGeneratedFiles"
    const val ANALYZE_DEPENDENCIES = "contractspec/analyzeDependencies"
    const val COMPARE_SPECS = "contractspec/compareSpecs"
    const val COMPARE_WITH_GIT = "contractspec/compareWithGit"
    const val ANALYZE_INTEGRITY = "contractspec/analyzeIntegrity"
    const val EXPORT_TO_OPENAPI = "contractspec/exportToOpenApi"
    const val IMPORT_FROM_OPENAPI = "contractspec/importFromOpenApi"
    const val VALIDATE_AGAINST_OPENAPI = "contractspec/validateAgainstOpenApi"
    const val BROWSE_REGISTRY = "contractspec/browseRegistry"
    const val SEARCH_REGISTRY = "contractspec/searchRegistry"
    const val ADD_FROM_REGISTRY = "contractspec/addFromRegistry"
    const val BROWSE_EXAMPLES = "contractspec/browseExamples"
    const val INIT_EXAMPLE = "contractspec/initExample"
    const val RUN_SETUP_WIZARD = "contractspec/runSetupWizard"
    const val RUN_QUICK_SETUP = "contractspec/runQuickSetup"
    const val RUN_DOCTOR_CHECK = "contractspec/runDoctorCheck"
    const val GET_WORKSPACE_INFO = "contractspec/getWorkspaceInfo"
    const val EXPORT_FOR_LLM = "contractspec/exportForLLM"
    const val GENERATE_IMPLEMENTATION_GUIDE = "contractspec/generateImplementationGuide"
    const val VERIFY_IMPLEMENTATION = "contractspec/verifyImplementation"

    // JSON-RPC message structures
    data class JsonRpcRequest(
        @SerializedName("jsonrpc")
        val version: String = "2.0",
        val id: Int,
        val method: String,
        val params: JsonObject? = null
    )

    data class JsonRpcResponse(
        @SerializedName("jsonrpc")
        val version: String = "2.0",
        val id: Int,
        val result: JsonObject? = null,
        val error: JsonRpcError? = null
    )

    data class JsonRpcError(
        val code: Int,
        val message: String,
        val data: JsonObject? = null
    ) {
        companion object {
            const val PARSE_ERROR = -32700
            const val INVALID_REQUEST = -32600
            const val METHOD_NOT_FOUND = -32601
            const val INVALID_PARAMS = -32602
            const val INTERNAL_ERROR = -32603
        }
    }

    // Notification (no response expected)
    data class JsonRpcNotification(
        @SerializedName("jsonrpc")
        val version: String = "2.0",
        val method: String,
        val params: JsonObject? = null
    )
}


