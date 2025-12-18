package tech.lssm.contractspec.completion

import com.intellij.codeInsight.completion.CompletionContributor
import com.intellij.codeInsight.completion.CompletionParameters
import com.intellij.codeInsight.completion.CompletionProvider
import com.intellij.codeInsight.completion.CompletionResultSet
import com.intellij.codeInsight.completion.CompletionType
import com.intellij.codeInsight.lookup.LookupElementBuilder
// Note: JavaScript PSI classes may not be available in basic setup
// This completion contributor is a placeholder for now
import com.intellij.patterns.PlatformPatterns
import com.intellij.util.ProcessingContext

/**
 * Provides completion for ContractSpec references (spec names in features).
 */
class ContractSpecCompletionContributor : CompletionContributor() {

    init {
        // Completion contributor is simplified for now
        // Full implementation will be added when JavaScript PSI is properly configured
    }

    private class ContractSpecCompletionProvider : CompletionProvider<CompletionParameters>() {

        override fun addCompletions(
            parameters: CompletionParameters,
            context: ProcessingContext,
            result: CompletionResultSet
        ) {
            val position = parameters.position
            val file = position.containingFile

            // Check if we're in a feature file
            val filePath = file.virtualFile?.path ?: return
            if (!filePath.endsWith(".feature.ts")) return

            // Check if we're in a spec reference context
            val text = position.text
            val parentText = position.parent?.text ?: return

            // Look for patterns like operations: [ { name: "..." } ]
            if (isInSpecReferenceArray(parentText)) {
                // For now, provide some example completions
                // In a full implementation, this would query available specs from the bridge
                val exampleSpecs = listOf(
                    "domain.createUser",
                    "domain.updateUser",
                    "domain.deleteUser",
                    "domain.listUsers",
                    "domain.getUser",
                    "domain.userCreated",
                    "domain.userUpdated",
                    "domain.userDeleted"
                )

                exampleSpecs.forEach { specName ->
                    result.addElement(
                        LookupElementBuilder.create("\"$specName\"")
                            .withPresentableText(specName)
                            .withTypeText("Spec Reference")
                    )
                }
            }
        }

        private fun isInSpecReferenceArray(text: String): Boolean {
            // Simple heuristic - check if we're in an array that might contain spec references
            return text.contains("operations:") ||
                   text.contains("events:") ||
                   text.contains("presentations:") ||
                   text.contains("experiments:")
        }
    }
}


