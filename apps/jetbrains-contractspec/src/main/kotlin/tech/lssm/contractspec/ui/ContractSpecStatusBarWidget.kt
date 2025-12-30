package tech.lssm.contractspec.ui

import com.intellij.openapi.wm.StatusBarWidget
import com.intellij.openapi.wm.StatusBar
import com.intellij.util.Consumer
import java.awt.Component
import java.awt.event.MouseEvent
import javax.swing.JLabel

/**
 * Status bar widget showing ContractSpec watch mode status.
 */
class ContractSpecStatusBarWidget : StatusBarWidget, StatusBarWidget.TextPresentation {

    private var watchEnabled = false
    private var statusLabel: JLabel? = null

    override fun ID(): String = "ContractSpec.Status"

    override fun getPresentation(): StatusBarWidget.WidgetPresentation = this

    override fun getText(): String {
        return if (watchEnabled) "ContractSpec: Watching" else "ContractSpec: Idle"
    }

    override fun getTooltipText(): String {
        return if (watchEnabled) {
            "ContractSpec watch mode is active. Specs are automatically rebuilt on changes."
        } else {
            "ContractSpec watch mode is disabled. Click to toggle."
        }
    }

    override fun getAlignment(): Float = Component.CENTER_ALIGNMENT

    override fun getClickConsumer(): Consumer<MouseEvent>? {
        return Consumer { event ->
            if (event.clickCount == 1) {
                // Toggle watch mode
                // This would call the watch toggle action
                // For now, just toggle the local state
                watchEnabled = !watchEnabled
                statusLabel?.text = getText()
            }
        }
    }

    override fun install(statusBar: StatusBar) {
        statusLabel = JLabel(getText())
        statusLabel?.toolTipText = getTooltipText()
    }

    override fun dispose() {
        statusLabel = null
    }

    /**
     * Update the watch status.
     */
    fun setWatchEnabled(enabled: Boolean) {
        watchEnabled = enabled
        statusLabel?.text = getText()
        statusLabel?.toolTipText = getTooltipText()
    }
}


