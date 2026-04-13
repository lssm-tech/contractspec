package tech.lssm.contractspec.bridge

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.intellij.openapi.diagnostic.Logger
import java.io.BufferedWriter
import java.io.InputStream
import java.io.OutputStreamWriter
import java.nio.charset.StandardCharsets
import java.nio.file.Paths
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

internal class JsonRpcBridgeClient(
    private val logger: Logger
) {

    private val gson = Gson()
    private val lock = Any()
    private val nextRequestId = AtomicInteger(1)
    private val pending = ConcurrentHashMap<Int, CompletableFuture<BridgeResponse>>()

    @Volatile
    private var process: Process? = null
    private var writer: BufferedWriter? = null
    private var workspaceRoot: String? = null

    @Volatile
    private var lastError: String? = null

    fun ensureStarted(requestedWorkspaceRoot: String?): Boolean {
        synchronized(lock) {
            val activeProcess = process
            val sameWorkspace = workspaceRoot == requestedWorkspaceRoot
            if (activeProcess?.isAlive == true && sameWorkspace) {
                return true
            }
            if (activeProcess?.isAlive == true) {
                stopLocked("Restarting bridge for a different workspace root.")
            }
            return startLocked(requestedWorkspaceRoot)
        }
    }

    fun stop() {
        synchronized(lock) {
            stopLocked("ContractSpec bridge stopped.")
        }
    }

    fun isRunning(): Boolean = synchronized(lock) {
        process?.isAlive == true
    }

    fun getLastError(): String? = lastError

    fun request(method: String, params: JsonObject? = null): CompletableFuture<BridgeResponse> {
        synchronized(lock) {
            if (process?.isAlive != true || writer == null) {
                return CompletableFuture.completedFuture(
                    BridgeResponse(false, error = lastError ?: "ContractSpec bridge is not running.")
                )
            }
            return sendRequestLocked(method, params)
        }
    }

    private fun startLocked(requestedWorkspaceRoot: String?): Boolean {
        val bridgeEntry = findBridgeEntry()
        if (bridgeEntry == null) {
            lastError = "Unable to locate packages/apps/jetbrains-contractspec/bridge/dist/server.js. Build the JetBrains bridge first."
            return false
        }

        return try {
            val bridgeDir = bridgeEntry.parent.parent
            val startedProcess = ProcessBuilder("node", bridgeEntry.toString())
                .directory(bridgeDir.toFile())
                .start()

            process = startedProcess
            writer = OutputStreamWriter(startedProcess.outputStream, StandardCharsets.UTF_8).buffered()
            workspaceRoot = requestedWorkspaceRoot
            startReaders(startedProcess)

            if (!initializeLocked(requestedWorkspaceRoot)) {
                stopLocked(lastError ?: "Failed to initialize ContractSpec bridge.")
                return false
            }

            lastError = null
            logger.info("ContractSpec bridge started for workspace: ${requestedWorkspaceRoot ?: "(unknown)"}")
            true
        } catch (error: Exception) {
            lastError = "Failed to launch ContractSpec bridge: ${error.message}"
            logger.warn(lastError, error)
            stopLocked(lastError ?: "Failed to launch ContractSpec bridge.")
            false
        }
    }

    private fun initializeLocked(requestedWorkspaceRoot: String?): Boolean {
        return try {
            val response = sendRequestLocked("initialize", buildInitializeParams(requestedWorkspaceRoot))
                .get(10, TimeUnit.SECONDS)
            if (!response.success) {
                lastError = response.error ?: "Bridge initialization failed."
                return false
            }
            sendNotificationLocked("initialized", JsonObject())
            true
        } catch (error: Exception) {
            lastError = "Failed to initialize ContractSpec bridge: ${error.message}"
            logger.warn(lastError, error)
            false
        }
    }

    private fun buildInitializeParams(requestedWorkspaceRoot: String?): JsonObject {
        return JsonObject().apply {
            addProperty("processId", ProcessHandle.current().pid())
            add("capabilities", JsonObject())
            if (!requestedWorkspaceRoot.isNullOrBlank()) {
                addProperty("rootPath", requestedWorkspaceRoot)
                addProperty("rootUri", Paths.get(requestedWorkspaceRoot).toUri().toString())
            }
        }
    }

    private fun sendRequestLocked(method: String, params: JsonObject?): CompletableFuture<BridgeResponse> {
        val requestId = nextRequestId.getAndIncrement()
        val future = CompletableFuture<BridgeResponse>()
        pending[requestId] = future

        val payload = JsonObject().apply {
            addProperty("jsonrpc", "2.0")
            addProperty("id", requestId)
            addProperty("method", method)
            if (params != null) {
                add("params", params)
            }
        }

        try {
            writeMessageLocked(payload)
        } catch (error: Exception) {
            pending.remove(requestId)
            future.complete(BridgeResponse(false, error = "Failed to send $method request: ${error.message}"))
        }

        return future
    }

    private fun sendNotificationLocked(method: String, params: JsonObject?) {
        val payload = JsonObject().apply {
            addProperty("jsonrpc", "2.0")
            addProperty("method", method)
            if (params != null) {
                add("params", params)
            }
        }
        writeMessageLocked(payload)
    }

    private fun writeMessageLocked(message: JsonObject) {
        val messageBody = gson.toJson(message)
        val bytes = messageBody.toByteArray(StandardCharsets.UTF_8)
        writer?.apply {
            write("Content-Length: ${bytes.size}\r\n\r\n")
            write(messageBody)
            flush()
        } ?: throw IllegalStateException("ContractSpec bridge writer is not available.")
    }

    private fun startReaders(startedProcess: Process) {
        val stdoutThread = Thread {
            runReadLoop(startedProcess.inputStream)
        }
        stdoutThread.name = "ContractSpecBridge-stdout"
        stdoutThread.isDaemon = true
        stdoutThread.start()

        val stderrThread = Thread {
            startedProcess.errorStream.bufferedReader(StandardCharsets.UTF_8).useLines { lines ->
                lines.forEach { line ->
                    logger.warn("ContractSpec bridge stderr: $line")
                }
            }
        }
        stderrThread.name = "ContractSpecBridge-stderr"
        stderrThread.isDaemon = true
        stderrThread.start()

        val watcherThread = Thread {
            val exitCode = startedProcess.waitFor()
            synchronized(lock) {
                if (process === startedProcess) {
                    process = null
                    writer = null
                    workspaceRoot = null
                    lastError = "ContractSpec bridge exited with code $exitCode."
                }
            }
            failPending("ContractSpec bridge exited with code $exitCode.", pending)
        }
        watcherThread.name = "ContractSpecBridge-watcher"
        watcherThread.isDaemon = true
        watcherThread.start()
    }

    private fun runReadLoop(inputStream: InputStream) {
        runBridgeReadLoop(
            inputStream = inputStream,
            logger = logger,
            onMessage = { rawMessage ->
                handleIncomingMessage(rawMessage, pending)
            },
            onFailure = { message ->
                synchronized(lock) {
                    lastError = message
                }
                failPending(message, pending)
            }
        )
    }

    private fun stopLocked(reason: String) {
        runCatching { writer?.close() }
        writer = null

        process?.let { activeProcess ->
            if (activeProcess.isAlive) {
                activeProcess.destroy()
                if (!activeProcess.waitFor(2, TimeUnit.SECONDS)) {
                    activeProcess.destroyForcibly()
                }
            }
        }
        process = null
        workspaceRoot = null
        lastError = reason
        failPending(reason, pending)
    }
}
