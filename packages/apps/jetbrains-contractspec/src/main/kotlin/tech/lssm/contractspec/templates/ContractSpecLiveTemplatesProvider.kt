package tech.lssm.contractspec.templates

import com.intellij.codeInsight.template.impl.DefaultLiveTemplatesProvider

/**
 * Provides ContractSpec live templates.
 */
class ContractSpecLiveTemplatesProvider : DefaultLiveTemplatesProvider {

    override fun getDefaultLiveTemplateFiles(): Array<String> {
        return arrayOf("liveTemplates/ContractSpec")
    }

    override fun getHiddenLiveTemplateFiles(): Array<String>? {
        return null
    }
}


