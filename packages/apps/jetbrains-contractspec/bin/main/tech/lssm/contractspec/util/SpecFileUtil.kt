package tech.lssm.contractspec.util

import com.intellij.openapi.vfs.VirtualFile
import java.io.File

/**
 * Utility functions for working with ContractSpec files.
 */
object SpecFileUtil {

    // Spec file extensions
    private val SPEC_EXTENSIONS = setOf(
        ".contracts.ts",
        ".event.ts",
        ".presentation.ts",
        ".feature.ts",
        ".capability.ts",
        ".workflow.ts",
        ".data-view.ts",
        ".form.ts",
        ".migration.ts",
        ".telemetry.ts",
        ".experiment.ts",
        ".app-config.ts",
        ".integration.ts",
        ".knowledge.ts",
        ".policy.ts",
        ".test-spec.ts"
    )

    /**
     * Check if a file is a ContractSpec file.
     */
    fun isSpecFile(file: VirtualFile): Boolean {
        return SPEC_EXTENSIONS.any { file.name.endsWith(it) }
    }

    /**
     * Check if a file path is a ContractSpec file.
     */
    fun isSpecFile(filePath: String): Boolean {
        return SPEC_EXTENSIONS.any { filePath.endsWith(it) }
    }

    /**
     * Get the spec type from a file path.
     */
    fun getSpecType(filePath: String): String? {
        val extension = SPEC_EXTENSIONS.find { filePath.endsWith(it) } ?: return null
        return when (extension) {
            ".contracts.ts" -> "operation"
            ".event.ts" -> "event"
            ".presentation.ts" -> "presentation"
            ".feature.ts" -> "feature"
            ".capability.ts" -> "capability"
            ".workflow.ts" -> "workflow"
            ".data-view.ts" -> "data-view"
            ".form.ts" -> "form"
            ".migration.ts" -> "migration"
            ".telemetry.ts" -> "telemetry"
            ".experiment.ts" -> "experiment"
            ".app-config.ts" -> "app-config"
            ".integration.ts" -> "integration"
            ".knowledge.ts" -> "knowledge"
            ".policy.ts" -> "policy"
            ".test-spec.ts" -> "test-spec"
            else -> null
        }
    }

    /**
     * Extract spec name from file path.
     */
    fun getSpecNameFromPath(filePath: String): String {
        val fileName = File(filePath).name
        // Remove extension
        return fileName.substringBeforeLast(".")
    }

    /**
     * Find all spec files in a directory recursively.
     */
    fun findSpecFiles(directory: File): List<File> {
        val specFiles = mutableListOf<File>()

        directory.walkTopDown().forEach { file ->
            if (file.isFile && isSpecFile(file.absolutePath)) {
                specFiles.add(file)
            }
        }

        return specFiles
    }

    /**
     * Get the relative path from workspace root.
     */
    fun getRelativePath(workspaceRoot: String, filePath: String): String {
        val workspaceFile = File(workspaceRoot)
        val file = File(filePath)

        return workspaceFile.toURI().relativize(file.toURI()).path
    }

    /**
     * Check if a directory contains any spec files.
     */
    fun containsSpecFiles(directory: File): Boolean {
        return findSpecFiles(directory).isNotEmpty()
    }

    /**
     * Get all spec types.
     */
    fun getAllSpecTypes(): Set<String> {
        return setOf(
            "operation",
            "event",
            "presentation",
            "feature",
            "capability",
            "workflow",
            "data-view",
            "form",
            "migration",
            "telemetry",
            "experiment",
            "app-config",
            "integration",
            "knowledge",
            "policy",
            "test-spec"
        )
    }

    /**
     * Get grouping modes for specs explorer.
     */
    fun getGroupingModes(): Map<String, String> {
        return mapOf(
            "type" to "Group specs by type (operation, event, presentation, etc.)",
            "package" to "Group specs by package (for monorepos)",
            "namespace" to "Group specs by namespace (extracted from spec name)",
            "owner" to "Group specs by owner",
            "tag" to "Group specs by tag",
            "stability" to "Group specs by stability level"
        )
    }
}


