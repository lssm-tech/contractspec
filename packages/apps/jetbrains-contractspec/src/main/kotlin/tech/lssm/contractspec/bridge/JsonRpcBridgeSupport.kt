package tech.lssm.contractspec.bridge

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.intellij.openapi.diagnostic.Logger
import java.io.BufferedInputStream
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.nio.charset.StandardCharsets
import java.nio.file.Path
import java.nio.file.Paths
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap
import kotlin.io.path.exists

internal fun runBridgeReadLoop(
    inputStream: InputStream,
    logger: Logger,
    onMessage: (String) -> Unit,
    onFailure: (String) -> Unit
) {
    val buffered = BufferedInputStream(inputStream)
    try {
        while (true) {
            val headers = readBridgeHeaders(buffered) ?: break
            val contentLength = headers["content-length"]?.toIntOrNull() ?: continue
            val payloadBytes = buffered.readNBytes(contentLength)
            if (payloadBytes.size != contentLength) {
                throw IllegalStateException("Unexpected end of bridge output stream.")
            }
            onMessage(String(payloadBytes, StandardCharsets.UTF_8))
        }
    } catch (error: Exception) {
        logger.warn("ContractSpec bridge reader failed: ${error.message}", error)
        onFailure("ContractSpec bridge reader failed: ${error.message}")
    }
}

internal fun handleIncomingMessage(
    rawMessage: String,
    pending: ConcurrentHashMap<Int, CompletableFuture<BridgeResponse>>
) {
    val payload = JsonParser.parseString(rawMessage).asJsonObject
    if (!payload.has("id")) {
        return
    }

    val requestId = payload.get("id").asInt
    val future = pending.remove(requestId) ?: return
    if (payload.has("error")) {
        val error = payload.getAsJsonObject("error")
        future.complete(BridgeResponse(false, error = error.get("message")?.asString ?: "Unknown bridge error"))
        return
    }

    val result = payload.get("result")
    val resultObject = when {
        result == null || result.isJsonNull -> null
        result.isJsonObject -> result.asJsonObject
        else -> JsonObject().apply { add("value", result) }
    }
    future.complete(BridgeResponse(true, data = resultObject))
}

internal fun failPending(
    message: String,
    pending: ConcurrentHashMap<Int, CompletableFuture<BridgeResponse>>
) {
    pending.entries.toList().forEach { (requestId, future) ->
        if (pending.remove(requestId, future)) {
            future.complete(BridgeResponse(false, error = message))
        }
    }
}

internal fun findBridgeEntry(): Path? {
    val direct = System.getenv("CONTRACTSPEC_JETBRAINS_BRIDGE_DIR")
        ?.takeIf { it.isNotBlank() }
        ?.let { Paths.get(it).resolve("dist/server.js") }
    if (direct?.exists() == true) {
        return direct
    }

    var current: Path? = Paths.get(System.getProperty("user.dir", ".")).toAbsolutePath()
    while (current != null) {
        val directCandidate = current.resolve("bridge/dist/server.js")
        if (directCandidate.exists()) {
            return directCandidate
        }
        val workspaceCandidate = current.resolve("packages/apps/jetbrains-contractspec/bridge/dist/server.js")
        if (workspaceCandidate.exists()) {
            return workspaceCandidate
        }
        current = current.parent
    }

    return null
}

private fun readBridgeHeaders(inputStream: InputStream): Map<String, String>? {
    val headers = mutableMapOf<String, String>()
    while (true) {
        val line = readBridgeHeaderLine(inputStream) ?: return if (headers.isEmpty()) null else headers
        if (line.isBlank()) {
            return headers
        }
        val separator = line.indexOf(':')
        if (separator > 0) {
            headers[line.substring(0, separator).trim().lowercase()] = line.substring(separator + 1).trim()
        }
    }
}

private fun readBridgeHeaderLine(inputStream: InputStream): String? {
    val buffer = ByteArrayOutputStream()
    while (true) {
        val nextByte = inputStream.read()
        if (nextByte == -1) {
            return if (buffer.size() == 0) null else buffer.toString(StandardCharsets.UTF_8)
        }
        if (nextByte == '\n'.code) {
            return buffer.toString(StandardCharsets.UTF_8).trimEnd('\r')
        }
        buffer.write(nextByte)
    }
}
