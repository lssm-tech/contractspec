import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "2.0.21"
    id("org.jetbrains.intellij.platform") version "2.0.1"
}

kotlin {
    jvmToolchain(17)
}

group = "tech.lssm.contractspec"
version = "0.0.1"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        // Target WebStorm (includes JavaScript support)
        webstorm("2024.3.2")

        // Include JavaScript and CSS plugins
        bundledPlugin("JavaScript")
        bundledPlugin("com.intellij.css")

        // Required for instrumentation
        instrumentationTools()
    }

    // Note: Dependencies simplified for initial setup
    // Bridge communication will use standard Java APIs for now

    // Test dependencies
    testImplementation(kotlin("test"))
}

intellijPlatform {
    pluginConfiguration {
        name = "ContractSpec"
        description = "Spec-first development for AI-written software"
        version = project.version.toString()

        ideaVersion {
            sinceBuild = "243" // IntelliJ 2024.3+
            untilBuild = "262.*" // IntelliJ 2026.2+
        }
    }

    publishing {
        token = providers.environmentVariable("JETBRAINS_TOKEN")
        channels = listOf("default")
    }
}

tasks {
    test {
        useJUnitPlatform()
    }

    // Note: Custom buildBridge and packagePlugin tasks removed for simplicity
    // Use standard Gradle tasks and build the bridge manually if needed
}





