package tech.lssm.contractspec.settings

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.*
import com.intellij.util.xmlb.XmlSerializerUtil

/**
 * Application-level settings for ContractSpec plugin.
 */
@State(
    name = "ContractSpecSettings",
    storages = [Storage("contractspec.xml")]
)
@Service(Service.Level.APP)
class ContractSpecSettings : PersistentStateComponent<ContractSpecSettings.State> {

    companion object {
        fun getInstance(): ContractSpecSettings {
            return ApplicationManager.getApplication().getService(ContractSpecSettings::class.java)
        }
    }

    data class State(
        var apiBaseUrl: String = "",
        var posthogHost: String = "https://eu.posthog.com",
        var posthogProjectKey: String = "",
        var validationOnSave: Boolean = true,
        var validationOnOpen: Boolean = true,
        var registryBaseUrl: String = "https://registry.contractspec.io",
        var specsGroupingMode: String = "type",
        var telemetryEnabled: Boolean = true
    )

    private var state = State()

    override fun getState(): State = state

    override fun loadState(state: State) {
        XmlSerializerUtil.copyBean(state, this.state)
    }

    // Convenience properties
    var apiBaseUrl: String
        get() = state.apiBaseUrl
        set(value) { state.apiBaseUrl = value }

    var posthogHost: String
        get() = state.posthogHost
        set(value) { state.posthogHost = value }

    var posthogProjectKey: String
        get() = state.posthogProjectKey
        set(value) { state.posthogProjectKey = value }

    var validationOnSave: Boolean
        get() = state.validationOnSave
        set(value) { state.validationOnSave = value }

    var validationOnOpen: Boolean
        get() = state.validationOnOpen
        set(value) { state.validationOnOpen = value }

    var registryBaseUrl: String
        get() = state.registryBaseUrl
        set(value) { state.registryBaseUrl = value }

    var specsGroupingMode: String
        get() = state.specsGroupingMode
        set(value) { state.specsGroupingMode = value }

    var telemetryEnabled: Boolean
        get() = state.telemetryEnabled
        set(value) { state.telemetryEnabled = value }

    // Computed properties
    val isRemoteFeaturesEnabled: Boolean
        get() = apiBaseUrl.isNotBlank()

    val isTelemetryEnabled: Boolean
        get() = telemetryEnabled && (isRemoteFeaturesEnabled || posthogProjectKey.isNotBlank())
}


