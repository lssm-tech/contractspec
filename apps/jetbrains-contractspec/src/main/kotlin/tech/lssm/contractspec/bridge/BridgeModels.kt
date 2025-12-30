package tech.lssm.contractspec.bridge

import com.google.gson.annotations.SerializedName

/**
 * Data models for bridge communication.
 */

// Validation models
data class ValidationRequest(
    val filePath: String
)

data class ValidationResult(
    val valid: Boolean,
    val errors: List<String> = emptyList(),
    val warnings: List<String> = emptyList()
)

data class BulkValidationRequest(
    val filePaths: List<String>
)

data class BulkValidationResult(
    val results: Map<String, ValidationResult>
)

// Build models
data class BuildRequest(
    val filePath: String
)

data class BuildResult(
    val success: Boolean,
    val outputPath: String? = null,
    val artifacts: List<String> = emptyList(),
    val errors: List<String> = emptyList()
)

data class SyncResult(
    val specsProcessed: Int,
    val specsBuilt: Int,
    val specsFailed: Int,
    val errors: List<String> = emptyList()
)

// Watch models
data class WatchRequest(
    val enabled: Boolean
)

data class WatchStatus(
    val enabled: Boolean,
    val watching: List<String> = emptyList()
)

// Clean models
data class CleanRequest(
    val dryRun: Boolean = false
)

data class CleanResult(
    val filesRemoved: List<String> = emptyList(),
    val filesSkipped: List<String> = emptyList(),
    val dryRun: Boolean = false
)

// Analysis models
data class DependencyAnalysis(
    val dependencies: Map<String, List<String>>,
    val circularDeps: List<List<String>> = emptyList()
)

data class IntegrityAnalysis(
    val orphanedSpecs: List<SpecSummary>,
    val issues: List<IntegrityIssue> = emptyList(),
    val inventory: SpecInventory
)

data class IntegrityIssue(
    val type: String,
    val severity: String, // "error" | "warning"
    val message: String,
    val file: String,
    val featureKey: String? = null
)

data class SpecInventory(
    val operations: Map<String, SpecSummary>,
    val events: Map<String, SpecSummary>,
    val presentations: Map<String, SpecSummary>,
    val experiments: Map<String, SpecSummary>
)

data class SpecSummary(
    val name: String,
    val version: Int,
    val file: String,
    val type: String
)

// Comparison models
data class CompareRequest(
    val leftPath: String,
    val rightPath: String,
    val semantic: Boolean = true
)

data class CompareResult(
    val identical: Boolean,
    val differences: List<String> = emptyList(),
    val leftOnly: List<String> = emptyList(),
    val rightOnly: List<String> = emptyList()
)

data class GitCompareRequest(
    val filePath: String
)

data class GitCompareResult(
    val hasChanges: Boolean,
    val gitDiff: String? = null,
    val semanticDiff: CompareResult? = null
)

// OpenAPI models
data class OpenApiExportRequest(
    val specPath: String
)

data class OpenApiExportResult(
    val openApiSpec: String,
    val outputPath: String
)

data class OpenApiImportRequest(
    val openApiPath: String,
    val outputPath: String
)

data class OpenApiImportResult(
    val specsCreated: List<String>,
    val errors: List<String> = emptyList()
)

data class OpenApiValidateRequest(
    val specPath: String,
    val openApiPath: String
)

data class OpenApiValidateResult(
    val valid: Boolean,
    val differences: List<String> = emptyList(),
    val errors: List<String> = emptyList()
)

// Registry models
data class RegistryItem(
    val id: String,
    val name: String,
    val version: String,
    val description: String,
    val tags: List<String> = emptyList(),
    val author: String? = null
)

data class RegistryBrowseResult(
    val items: List<RegistryItem>
)

data class RegistrySearchRequest(
    val query: String
)

data class RegistrySearchResult(
    val items: List<RegistryItem>
)

data class RegistryAddRequest(
    val specId: String,
    val outputPath: String
)

data class RegistryAddResult(
    val success: Boolean,
    val filesCreated: List<String> = emptyList(),
    val errors: List<String> = emptyList()
)

// Examples models
data class ExampleItem(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    val complexity: String // "beginner" | "intermediate" | "advanced"
)

data class ExamplesBrowseResult(
    val examples: List<ExampleItem>
)

data class ExampleInitRequest(
    val exampleId: String,
    val outputPath: String
)

data class ExampleInitResult(
    val success: Boolean,
    val filesCreated: List<String> = emptyList(),
    val errors: List<String> = emptyList()
)

// Setup models
data class SetupResult(
    val success: Boolean,
    val configCreated: Boolean = false,
    val filesModified: List<String> = emptyList(),
    val errors: List<String> = emptyList()
)

data class DoctorResult(
    val healthy: Boolean,
    val checks: List<DoctorCheck>,
    val recommendations: List<String> = emptyList()
)

data class DoctorCheck(
    val name: String,
    val status: String, // "pass" | "fail" | "warn"
    val message: String,
    val details: String? = null
)

// Workspace models
data class WorkspaceInfo(
    val packageManager: String,
    val workspaceRoot: String,
    val isMonorepo: Boolean,
    val packageRoot: String? = null,
    val packageName: String? = null,
    val specsFound: Int = 0,
    val featuresFound: Int = 0
)

// LLM models
data class LLMExportRequest(
    val specPath: String,
    val format: String? = null
)

data class LLMExportResult(
    val content: String,
    val format: String,
    val specName: String,
    val specVersion: Int
)

data class LLMGuideRequest(
    val specPath: String
)

data class LLMGuideResult(
    val guide: String,
    val specName: String,
    val recommendations: List<String> = emptyList()
)

data class LLMVerifyRequest(
    val specPath: String,
    val implementationPaths: List<String>
)

data class LLMVerifyResult(
    val verified: Boolean,
    val issues: List<String> = emptyList(),
    val suggestions: List<String> = emptyList(),
    val coverage: Double // percentage of spec covered by implementation
)

// List specs models
data class ListSpecsResult(
    val specs: List<SpecInfo>
)

data class SpecInfo(
    val name: String,
    val version: Int,
    val filePath: String,
    val specType: String, // "command", "query", "event", "presentation", etc.
    val stability: String,
    val description: String? = null,
    val tags: List<String> = emptyList(),
    val owners: List<String> = emptyList()
)


