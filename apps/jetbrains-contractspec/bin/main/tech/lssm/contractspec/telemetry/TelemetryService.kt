package tech.lssm.contractspec.telemetry

import com.google.gson.JsonObject
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.util.SystemInfo
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import tech.lssm.contractspec.settings.ContractSpecSettings
import java.util.concurrent.TimeUnit

/**
 * Service for handling telemetry and analytics.
 */
interface TelemetryService {

    /**
     * Initialize the telemetry service.
     */
    fun initialize()

    /**
     * Track an event.
     */
    fun trackEvent(event: String, properties: Map<String, Any> = emptyMap())

    /**
     * Check if telemetry is enabled.
     */
    fun isTelemetryEnabled(): Boolean

    /**
     * Shutdown the telemetry service.
     */
    fun shutdown()
}

/**
 * Implementation of TelemetryService.
 */
@Service(Service.Level.APP)
class TelemetryServiceImpl : TelemetryService {

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(5, TimeUnit.SECONDS)
        .build()

    private val settings = ContractSpecSettings.getInstance()
    private var initialized = false
    private var userId: String? = null

    override fun initialize() {
        if (initialized) return

        // Generate or load user ID
        userId = generateUserId()

        // Check if telemetry is enabled globally
        if (!isTelemetryEnabled()) {
            return
        }

        initialized = true
    }

    override fun trackEvent(event: String, properties: Map<String, Any>) {
        if (!initialized || !isTelemetryEnabled()) {
            return
        }

        ApplicationManager.getApplication().executeOnPooledThread {
            try {
                sendEvent(event, properties)
            } catch (e: Exception) {
                // Silently fail telemetry errors
            }
        }
    }

    override fun isTelemetryEnabled(): Boolean {
        return settings.isTelemetryEnabled
    }

    override fun shutdown() {
        httpClient.dispatcher.executorService.shutdown()
        httpClient.connectionPool.evictAll()
    }

    private fun sendEvent(event: String, properties: Map<String, Any>) {
        val payload = JsonObject().apply {
            addProperty("event", event)
            addProperty("user_id", userId)
            addProperty("timestamp", System.currentTimeMillis())
            addProperty("platform", "jetbrains")
            addProperty("ide_version", getIdeVersion())
            addProperty("plugin_version", getPluginVersion())
            addProperty("os", SystemInfo.getOsNameAndVersion())

            // Add custom properties
            properties.forEach { (key, value) ->
                when (value) {
                    is String -> addProperty(key, value)
                    is Number -> addProperty(key, value)
                    is Boolean -> addProperty(key, value)
                    else -> addProperty(key, value.toString())
                }
            }
        }

        if (settings.isRemoteFeaturesEnabled) {
            // Send to API
            sendToApi(payload)
        } else if (settings.posthogProjectKey.isNotBlank()) {
            // Send directly to PostHog
            sendToPostHog(payload)
        }
    }

    private fun sendToApi(payload: JsonObject) {
        val url = "${settings.apiBaseUrl}/api/telemetry/ingest"
        val requestBody = payload.toString().toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()

        httpClient.newCall(request).execute().use { response ->
            // API telemetry is fire-and-forget
        }
    }

    private fun sendToPostHog(payload: JsonObject) {
        val url = "${settings.posthogHost}/capture/"
        val posthogPayload = JsonObject().apply {
            addProperty("api_key", settings.posthogProjectKey)
            add("event", payload.get("event"))
            add("properties", payload)
            addProperty("distinct_id", userId)
        }

        val requestBody = posthogPayload.toString().toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()

        httpClient.newCall(request).execute().use { response ->
            // PostHog telemetry is fire-and-forget
        }
    }

    private fun generateUserId(): String {
        // Generate a stable user ID based on system properties
        // Simplified for now
        return "anonymous-user"
    }

    private fun getIdeVersion(): String {
        return "WebStorm-2024.3.1"
    }

    private fun getPluginVersion(): String {
        // Get from plugin.xml or hardcoded for now
        return "0.0.1"
    }
}


