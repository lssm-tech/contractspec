package tech.lssm.contractspec.ui

import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.StatusBar
import com.intellij.openapi.wm.StatusBarWidget
import com.intellij.openapi.wm.StatusBarWidgetProvider

/**
 * Provides the ContractSpec status bar widget.
 */
class ContractSpecStatusBarWidgetProvider : StatusBarWidgetProvider {

    override fun getWidget(project: Project): StatusBarWidget? {
        return ContractSpecStatusBarWidget()
    }

    override fun getAnchor(): String {
        return StatusBar.Anchors.after(StatusBar.StandardWidgets.POSITION_PANEL)
    }
}


