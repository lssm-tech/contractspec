package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.SimpleToolWindowPanel
import com.intellij.openapi.vfs.LocalFileSystem
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBScrollPane
import com.intellij.ui.table.JBTable
import tech.lssm.contractspec.bridge.NodeBridgeService
import java.awt.BorderLayout
import java.awt.Color
import java.awt.Component
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent
import javax.swing.JPanel
import javax.swing.SwingUtilities
import javax.swing.table.DefaultTableCellRenderer
import javax.swing.table.DefaultTableModel

/**
 * Dependencies tool window showing spec dependency graph as a table.
 *
 * Columns: Spec | Dependencies | Circular?
 * Circular dependencies are highlighted with a warning colour.
 * Clicking a spec name opens its file in the editor.
 */
class DependenciesToolWindow(private val project: Project) {

    private val tableModel = DepsTableModel()
    private val table = JBTable(tableModel)
    private val statusLabel = JBLabel("Click Refresh to load dependency data")

    private var specFilePaths = mutableMapOf<String, String>()
    private var circularSpecs = mutableSetOf<String>()

    init {
        table.setShowGrid(true)
        table.rowHeight = 24
        table.setDefaultRenderer(Any::class.java, DepsCellRenderer())

        table.addMouseListener(object : MouseAdapter() {
            override fun mouseClicked(e: MouseEvent) {
                if (e.clickCount == 2) {
                    val row = table.selectedRow
                    if (row >= 0) {
                        val specName = table.getValueAt(row, 0) as? String ?: return
                        openSpecFile(specName)
                    }
                }
            }
        })
    }

    fun createComponent(): JPanel {
        val panel = SimpleToolWindowPanel(true, true)

        val toolbar = JPanel(BorderLayout())
        val refreshButton = JBLabel("Refresh")
        refreshButton.addMouseListener(object : MouseAdapter() {
            override fun mouseClicked(e: MouseEvent) {
                refresh()
            }
        })
        toolbar.add(refreshButton, BorderLayout.EAST)
        toolbar.add(statusLabel, BorderLayout.WEST)

        panel.toolbar = toolbar
        panel.setContent(JBScrollPane(table))
        panel.putClientProperty(INSTANCE_KEY, this)
        return panel
    }

    companion object {
        private const val INSTANCE_KEY = "DependenciesToolWindow"

        /**
         * Retrieve the DependenciesToolWindow instance from a tabbed pane
         * by scanning tabs for the stored client property.
         */
        fun getInstance(tabbedPane: com.intellij.ui.components.JBTabbedPane): DependenciesToolWindow? {
            for (i in 0 until tabbedPane.tabCount) {
                val component = tabbedPane.getComponentAt(i) as? JPanel
                val instance = component?.getClientProperty(INSTANCE_KEY)
                if (instance is DependenciesToolWindow) return instance
            }
            return null
        }
    }

    fun refresh() {
        statusLabel.text = "Loading..."
        ApplicationManager.getApplication().executeOnPooledThread {
            try {
                val bridgeService = ApplicationManager.getApplication()
                    .getService(NodeBridgeService::class.java)
                if (!bridgeService.ensureBridgeRunning()) {
                    updateStatus("Bridge server not available")
                    return@executeOnPooledThread
                }

                val depsResult = bridgeService.analyzeDependencies().get()
                if (!depsResult.success) {
                    updateStatus("Analysis failed: ${depsResult.error}")
                    return@executeOnPooledThread
                }

                val data = depsResult.data ?: run {
                    updateStatus("No data received")
                    return@executeOnPooledThread
                }

                val dependencies = data.get("dependencies")?.asJsonObject
                val circularDeps = data.get("circularDeps")?.asJsonArray?.map { depArray ->
                    depArray.asJsonArray.map { it.asString }
                } ?: emptyList()

                circularSpecs.clear()
                circularDeps.flatten().forEach { circularSpecs.add(it) }

                val specsData = data.get("specs")?.asJsonArray
                specFilePaths.clear()
                specsData?.forEach { specJson ->
                    val obj = specJson.asJsonObject
                    val name = obj.get("name")?.asString
                    val path = obj.get("filePath")?.asString
                    if (name != null && path != null) {
                        specFilePaths[name] = path
                    }
                }

                val rows = mutableListOf<Array<Any>>()
                if (dependencies != null) {
                    for ((spec, deps) in dependencies.entrySet()) {
                        val depsList = deps.asJsonArray.map { it.asString }
                        val isCircular = circularSpecs.contains(spec)
                        rows.add(arrayOf(
                            spec,
                            depsList.joinToString(", "),
                            if (isCircular) "⚠ Yes" else ""
                        ))
                    }
                }

                SwingUtilities.invokeLater {
                    tableModel.setData(rows)
                    val circularCount = circularDeps.size
                    val specCount = dependencies?.size() ?: 0
                    statusLabel.text = "$specCount specs with dependencies" +
                        if (circularCount > 0) " ($circularCount circular)" else ""
                }
            } catch (e: Exception) {
                updateStatus("Error: ${e.message}")
            }
        }
    }

    private fun updateStatus(message: String) {
        SwingUtilities.invokeLater { statusLabel.text = message }
    }

    private fun openSpecFile(specName: String) {
        val filePath = specFilePaths[specName] ?: return
        val virtualFile = LocalFileSystem.getInstance().findFileByPath(filePath) ?: return
        FileEditorManager.getInstance(project).openFile(virtualFile, true)
    }

    private inner class DepsCellRenderer : DefaultTableCellRenderer() {
        override fun getTableCellRendererComponent(
            table: javax.swing.JTable,
            value: Any?,
            isSelected: Boolean,
            hasFocus: Boolean,
            row: Int,
            column: Int
        ): Component {
            val c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column)
            if (!isSelected) {
                val specName = table.getValueAt(row, 0) as? String
                c.background = if (specName != null && circularSpecs.contains(specName)) {
                    Color(255, 255, 200)
                } else {
                    Color.WHITE
                }
            }
            return c
        }
    }
}

private class DepsTableModel : DefaultTableModel() {
    private val columnNames = arrayOf("Spec", "Dependencies", "Circular")
    private var rows = mutableListOf<Array<Any>>()

    override fun getColumnCount(): Int = columnNames.size
    override fun getColumnName(column: Int): String = columnNames[column]
    override fun getRowCount(): Int = rows?.size ?: 0
    override fun getValueAt(row: Int, column: Int): Any = rows[row][column]
    override fun isCellEditable(row: Int, column: Int): Boolean = false

    fun setData(newRows: List<Array<Any>>) {
        rows = newRows.toMutableList()
        fireTableDataChanged()
    }
}
