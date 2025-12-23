package tech.lssm.contractspec.toolwindow

import com.intellij.openapi.project.Project
import com.intellij.openapi.util.Condition

/**
 * Condition for when the ContractSpec tool window should be available.
 */
class ContractSpecToolWindowCondition : Condition<Project> {

    override fun value(project: Project?): Boolean {
        if (project == null) return false

        // For now, always show the tool window
        // In the future, we could check if there are ContractSpec files in the project
        return true
    }
}


