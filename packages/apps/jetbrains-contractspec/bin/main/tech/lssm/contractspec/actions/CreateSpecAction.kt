package tech.lssm.contractspec.actions

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.DialogWrapper
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.ui.ValidationInfo
import com.intellij.ui.components.JBTextField
import tech.lssm.contractspec.telemetry.TelemetryService
import tech.lssm.contractspec.util.SpecFileUtil
import java.io.File
import javax.swing.JComponent
import javax.swing.JComboBox
import javax.swing.JPanel
import javax.swing.JLabel

/**
 * Action to create a new ContractSpec file with a wizard dialog.
 */
class CreateSpecAction : AnAction() {

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return

        // Track telemetry
        val telemetry = ApplicationManager.getApplication().getService(TelemetryService::class.java)
        telemetry?.trackEvent("jetbrains_action_create_spec")

        // Show creation dialog
        val dialog = CreateSpecDialog(project)
        if (dialog.showAndGet()) {
            val specData = dialog.getSpecData()
            createSpecFile(project, specData)
        }
    }

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabled = e.project != null
    }

    private fun createSpecFile(project: Project, specData: SpecCreationData) {
        try {
            val fileName = "${specData.name}.${specData.type}.ts"
            val content = generateSpecContent(specData)

            // For now, just show the content in a message
            // In a real implementation, this would create the file in the project
            Messages.showInfoMessage(
                project,
                "Spec creation template generated:\n\n$content",
                "Spec Template Generated"
            )

            // TODO: Actually create the file in the project structure
            // This would require:
            // 1. Choosing a directory in the project
            // 2. Creating the file with the generated content
            // 3. Opening it in the editor

        } catch (e: Exception) {
            Messages.showErrorDialog(
                project,
                "Failed to create spec file: ${e.message}",
                "Create Spec Error"
            )
        }
    }

    private fun generateSpecContent(specData: SpecCreationData): String {
        return when (specData.type) {
            "contracts" -> generateCommandSpec(specData)
            "event" -> generateEventSpec(specData)
            "presentation" -> generatePresentationSpec(specData)
            "feature" -> generateFeatureSpec(specData)
            else -> "// Generated ${specData.type} spec: ${specData.name}\n// TODO: Implement spec content"
        }
    }

    private fun generateCommandSpec(data: SpecCreationData): String {
        return """
import { defineCommand } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const ${data.name}Input = defineSchemaModel({
  name: '${data.name}Input',
  fields: {
    // TODO: Define input fields
    exampleField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ${data.name}Output = defineSchemaModel({
  name: '${data.name}Output',
  fields: {
    ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const ${data.name}Spec = defineCommand({
  meta: {
    name: '${data.domain}.${data.name}',
    version: 1,
    stability: 'experimental',
    owners: ['@${data.team}'],
    tags: ['${data.tag}'],
    description: '${data.description}',
    goal: '${data.goal}',
    context: '${data.context}',
  },

  io: {
    input: ${data.name}Input,
    output: ${data.name}Output,
    errors: {
      // TODO: Define possible errors
    },
  },

  policy: {
    auth: '${data.auth}',
  },

  transport: {
    rest: { method: 'POST' },
  },
});
        """.trimIndent()
    }

    private fun generateEventSpec(data: SpecCreationData): String {
        return """
import { defineEvent } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const ${data.name}Payload = defineSchemaModel({
  name: '${data.name}Payload',
  fields: {
    // TODO: Define payload fields
    exampleField: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ${data.name}Event = defineEvent({
  name: '${data.domain}.${data.name}',
  version: 1,
  description: '${data.description}',
  payload: ${data.name}Payload,
  pii: [],
});
        """.trimIndent()
    }

    private fun generatePresentationSpec(data: SpecCreationData): String {
        return """
import type { PresentationSpec } from '@lssm/lib.contracts/presentations';

export const ${data.name}Presentation: PresentationSpec = {
  meta: {
    name: '${data.domain}.${data.name}',
    version: 1,
    description: '${data.description}',
    owners: ['@${data.team}'],
    tags: ['${data.tag}'],
  },
  content: {
    kind: 'web_component',
    // TODO: Define presentation content
  },
};
        """.trimIndent()
    }

    private fun generateFeatureSpec(data: SpecCreationData): String {
        return """
import type { FeatureSpec } from '@lssm/lib.contracts';

export const ${data.name}Feature: FeatureSpec = {
  name: '${data.domain}.${data.name}',
  version: 1,
  description: '${data.description}',
  stability: 'experimental',
  owners: ['@${data.team}'],
  tags: ['${data.tag}'],

  operations: [
    // TODO: Reference operation specs
    // { name: 'domain.operationName', version: 1 }
  ],

  events: [
    // TODO: Reference event specs
  ],

  presentations: [
    // TODO: Reference presentation specs
  ],
};
        """.trimIndent()
    }

    private data class SpecCreationData(
        val name: String,
        val type: String,
        val domain: String,
        val team: String,
        val tag: String,
        val description: String,
        val goal: String,
        val context: String,
        val auth: String
    )

    private class CreateSpecDialog(private val project: Project) : DialogWrapper(project) {

        private lateinit var nameField: JBTextField
        private lateinit var typeComboBox: JComboBox<String>
        private lateinit var domainField: JBTextField
        private lateinit var teamField: JBTextField
        private lateinit var tagField: JBTextField
        private lateinit var descriptionField: JBTextField
        private lateinit var goalField: JBTextField
        private lateinit var contextField: JBTextField
        private lateinit var authComboBox: JComboBox<String>

        init {
            title = "Create ContractSpec"
            init()
        }

        override fun createCenterPanel(): JComponent {
            nameField = JBTextField()
            typeComboBox = JComboBox(arrayOf(
                "contracts", "event", "presentation", "feature", "workflow",
                "data-view", "form", "migration", "telemetry", "experiment",
                "app-config", "integration", "knowledge", "policy", "test-spec"
            ))
            domainField = JBTextField("myapp")
            teamField = JBTextField("team")
            tagField = JBTextField("feature")
            descriptionField = JBTextField()
            goalField = JBTextField()
            contextField = JBTextField()
            authComboBox = JComboBox(arrayOf("user", "admin", "anonymous"))

            // Set defaults
            typeComboBox.selectedItem = "contracts"
            authComboBox.selectedItem = "user"

            // Simplified UI for now
            val panel = JPanel()
            panel.layout = java.awt.GridLayout(9, 2)

            panel.add(JLabel("Spec Name:"))
            panel.add(nameField)
            panel.add(JLabel("Type:"))
            panel.add(typeComboBox)
            panel.add(JLabel("Domain:"))
            panel.add(domainField)
            panel.add(JLabel("Team:"))
            panel.add(teamField)
            panel.add(JLabel("Tag:"))
            panel.add(tagField)
            panel.add(JLabel("Description:"))
            panel.add(descriptionField)
            panel.add(JLabel("Goal:"))
            panel.add(goalField)
            panel.add(JLabel("Context:"))
            panel.add(contextField)
            panel.add(JLabel("Auth Level:"))
            panel.add(authComboBox)

            return panel
        }

        fun getSpecData(): SpecCreationData {
            return SpecCreationData(
                name = nameField.text.trim(),
                type = typeComboBox.selectedItem as String,
                domain = domainField.text.trim(),
                team = teamField.text.trim(),
                tag = tagField.text.trim(),
                description = descriptionField.text.trim(),
                goal = goalField.text.trim(),
                context = contextField.text.trim(),
                auth = authComboBox.selectedItem as String
            )
        }

        override fun doValidate(): ValidationInfo? {
            if (nameField.text.trim().isEmpty()) {
                return ValidationInfo("Spec name is required", nameField)
            }
            if (domainField.text.trim().isEmpty()) {
                return ValidationInfo("Domain is required", domainField)
            }
            return null
        }
    }
}


