package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.SimpleToolWindowPanel
import com.intellij.ui.components.JBScrollPane
import com.intellij.ui.treeStructure.Tree
import com.intellij.util.ui.tree.TreeUtil
import tech.lssm.contractspec.bridge.NodeBridgeService
import tech.lssm.contractspec.settings.ContractSpecSettings
import tech.lssm.contractspec.util.SpecFileUtil
import java.awt.BorderLayout
import javax.swing.JPanel
import javax.swing.SwingUtilities
import javax.swing.tree.DefaultMutableTreeNode
import javax.swing.tree.DefaultTreeModel

/**
 * Specs Explorer tool window showing all ContractSpec files organized by grouping mode.
 */
class SpecsExplorerToolWindow(private val project: Project) {

    private val tree = Tree()
    private val treeModel = DefaultTreeModel(DefaultMutableTreeNode("Loading..."))
    private val settings = ContractSpecSettings.getInstance()

    init {
        tree.model = treeModel
        tree.isRootVisible = false

        // Add double-click handler to open files
        tree.addMouseListener(object : java.awt.event.MouseAdapter() {
            override fun mouseClicked(e: java.awt.event.MouseEvent) {
                if (e.clickCount == 2) {
                    val path = tree.selectionPath
                    if (path != null) {
                        val node = path.lastPathComponent as? SpecTreeNode
                        node?.openFile()
                    }
                }
            }
        })

        refresh()
    }

    fun createComponent(): JPanel {
        val panel = SimpleToolWindowPanel(true, true)

        // Create toolbar with grouping mode selector
        val toolbar = JPanel(BorderLayout())

        // TODO: Add grouping mode selector combo box
        // For now, just refresh button
        val refreshButton = com.intellij.ui.components.JBLabel("Refresh")
        refreshButton.addMouseListener(object : java.awt.event.MouseAdapter() {
            override fun mouseClicked(e: java.awt.event.MouseEvent) {
                refresh()
            }
        })
        toolbar.add(refreshButton, BorderLayout.EAST)

        panel.toolbar = toolbar
        panel.setContent(JBScrollPane(tree))

        return panel
    }

    fun refresh() {
        ApplicationManager.getApplication().executeOnPooledThread {
            try {
                val bridgeService = ApplicationManager.getApplication().getService(NodeBridgeService::class.java)
                if (!bridgeService.ensureBridgeRunning()) {
                    showError("Failed to start ContractSpec bridge server")
                    return@executeOnPooledThread
                }

                val listResult = bridgeService.listSpecs().get()
                if (!listResult.success) {
                    showError("Failed to list specs: ${listResult.error}")
                    return@executeOnPooledThread
                }

                val specs = listResult.data?.get("specs")?.asJsonArray
                if (specs == null) {
                    showError("No specs data received")
                    return@executeOnPooledThread
                }

                // Group specs by current grouping mode
                val groupedSpecs = groupSpecs(specs.map { specJson ->
                    val spec = specJson.asJsonObject
                    SpecInfo(
                        name = spec.get("name").asString,
                        version = spec.get("version").asInt,
                        filePath = spec.get("filePath").asString,
                        specType = spec.get("specType").asString,
                        stability = spec.get("stability")?.asString ?: "unknown",
                        description = spec.get("description")?.asString,
                        tags = spec.get("tags")?.asJsonArray?.map { it.asString } ?: emptyList(),
                        owners = spec.get("owners")?.asJsonArray?.map { it.asString } ?: emptyList()
                    )
                })

                // Update tree on EDT
                SwingUtilities.invokeLater {
                    updateTree(groupedSpecs)
                }

            } catch (e: Exception) {
                showError("Error refreshing specs: ${e.message}")
            }
        }
    }

    private fun groupSpecs(specs: List<SpecInfo>): Map<String, List<SpecInfo>> {
        val groupingMode = settings.specsGroupingMode

        return when (groupingMode) {
            "type" -> specs.groupBy { it.specType }
            "package" -> specs.groupBy { extractPackage(it.filePath) }
            "namespace" -> specs.groupBy { extractNamespace(it.name) }
            "owner" -> specs.groupBy { it.owners.firstOrNull() ?: "unassigned" }
            "tag" -> specs.groupBy { it.tags.firstOrNull() ?: "untagged" }
            "stability" -> specs.groupBy { it.stability }
            else -> specs.groupBy { it.specType }
        }
    }

    private fun extractPackage(filePath: String): String {
        // Simple package extraction - could be improved
        val pathParts = filePath.split("/").dropLast(1) // Remove filename
        return pathParts.lastOrNull() ?: "root"
    }

    private fun extractNamespace(name: String): String {
        // Extract namespace from spec name (e.g., "domain.subdomain" -> "domain")
        return name.split(".").firstOrNull() ?: "default"
    }

    private fun updateTree(groupedSpecs: Map<String, List<SpecInfo>>) {
        val root = DefaultMutableTreeNode("ContractSpec Specs")

        for ((groupName, specs) in groupedSpecs.entries.sortedBy { it.key }) {
            val groupNode = DefaultMutableTreeNode("$groupName (${specs.size})")

            for (spec in specs.sortedBy { it.name }) {
                groupNode.add(SpecTreeNode(spec))
            }

            root.add(groupNode)
        }

        treeModel.setRoot(root)
        TreeUtil.expandAll(tree)
    }

    private fun showError(message: String) {
        SwingUtilities.invokeLater {
            val root = DefaultMutableTreeNode("Error: $message")
            treeModel.setRoot(root)
        }
    }

    fun selectGroupingMode() {
        // TODO: Show grouping mode selection dialog
    }

    fun cycleGroupingMode() {
        val modes = SpecFileUtil.getGroupingModes().keys.toList()
        val currentIndex = modes.indexOf(settings.specsGroupingMode)
        val nextIndex = (currentIndex + 1) % modes.size
        settings.specsGroupingMode = modes[nextIndex]
        refresh()
    }

    data class SpecInfo(
        val name: String,
        val version: Int,
        val filePath: String,
        val specType: String,
        val stability: String,
        val description: String? = null,
        val tags: List<String> = emptyList(),
        val owners: List<String> = emptyList()
    )

    inner class SpecTreeNode(private val spec: SpecInfo) : DefaultMutableTreeNode() {

        init {
            userObject = "${spec.specType}: ${spec.name}.v${spec.version} (${spec.stability})"
        }

        fun openFile() {
            // TODO: Open the file in editor
            // This would use FileEditorManager to open the virtual file
        }
    }
}


