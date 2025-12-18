package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBScrollPane
import com.intellij.ui.treeStructure.Tree
import javax.swing.JPanel
import javax.swing.tree.DefaultMutableTreeNode
import javax.swing.tree.DefaultTreeModel

/**
 * Features tool window showing feature explorer.
 * Dedicated browser showing feature -> spec relationships with navigation.
 */
class FeaturesToolWindow(private val project: Project) {

    fun createComponent(): JPanel {
        val panel = JPanel()
        panel.layout = java.awt.BorderLayout()

        // Create tree for features
        val rootNode = DefaultMutableTreeNode("Features")

        // Add sample feature nodes (placeholder for now)
        val feature1Node = DefaultMutableTreeNode("user-authentication")
        feature1Node.add(DefaultMutableTreeNode("operations: login"))
        feature1Node.add(DefaultMutableTreeNode("events: user-logged-in"))
        feature1Node.add(DefaultMutableTreeNode("presentations: login-form"))

        val feature2Node = DefaultMutableTreeNode("payment-processing")
        feature2Node.add(DefaultMutableTreeNode("operations: process-payment"))
        feature2Node.add(DefaultMutableTreeNode("events: payment-completed"))

        rootNode.add(feature1Node)
        rootNode.add(feature2Node)

        val treeModel = DefaultTreeModel(rootNode)
        val tree = Tree(treeModel)
        tree.isRootVisible = false

        val scrollPane = JBScrollPane(tree)
        panel.add(scrollPane, java.awt.BorderLayout.CENTER)

        // Add header
        val headerLabel = JBLabel("Feature Explorer - Shows feature to spec relationships")
        headerLabel.border = javax.swing.BorderFactory.createEmptyBorder(5, 5, 5, 5)
        panel.add(headerLabel, java.awt.BorderLayout.NORTH)

        return panel
    }
}


