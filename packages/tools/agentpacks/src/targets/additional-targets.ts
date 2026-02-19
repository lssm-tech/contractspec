/**
 * Additional target generators for Phase 3 tools.
 * Uses the generic markdown target factory for consistent behavior.
 */
import { createGenericMdTarget } from './generic-md-target.js';

/**
 * Cline — VS Code AI extension.
 * Config: .cline/rules/*.md, .cline/mcp.json
 */
export const ClineTarget = createGenericMdTarget({
  id: 'cline',
  name: 'Cline',
  configDir: '.cline',
  supportedFeatures: ['rules', 'commands', 'mcp', 'ignore'],
  ignoreFile: '.clineignore',
  mcpInConfigDir: true,
});

/**
 * Kilo Code — AI coding assistant (Cline fork).
 * Config: .kilo/rules/*.md
 */
export const KiloTarget = createGenericMdTarget({
  id: 'kilo',
  name: 'Kilo Code',
  configDir: '.kilo',
  supportedFeatures: ['rules', 'commands', 'mcp', 'ignore'],
  ignoreFile: '.kiloignore',
  mcpInConfigDir: true,
});

/**
 * Roo Code — AI coding assistant (Cline fork).
 * Config: .roo/rules/*.md
 */
export const RooTarget = createGenericMdTarget({
  id: 'roo',
  name: 'Roo Code',
  configDir: '.roo',
  supportedFeatures: ['rules', 'commands', 'mcp', 'ignore'],
  ignoreFile: '.rooignore',
  mcpInConfigDir: true,
});

/**
 * Qwen Code — Alibaba's AI coding assistant.
 * Config: .qwencode/rules/*.md
 */
export const QwenCodeTarget = createGenericMdTarget({
  id: 'qwencode',
  name: 'Qwen Code',
  configDir: '.qwencode',
  supportedFeatures: ['rules', 'mcp', 'ignore'],
  ignoreFile: '.qwencodeignore',
  mcpInConfigDir: true,
});

/**
 * Kiro — AWS AI coding assistant.
 * Config: .kiro/rules/*.md
 */
export const KiroTarget = createGenericMdTarget({
  id: 'kiro',
  name: 'Kiro',
  configDir: '.kiro',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * Factory Droid — AI coding assistant.
 * Config: .factorydroid/rules/*.md
 */
export const FactoryDroidTarget = createGenericMdTarget({
  id: 'factorydroid',
  name: 'Factory Droid',
  configDir: '.factorydroid',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * AntiGravity — AI coding assistant.
 * Config: .antigravity/rules/*.md
 */
export const AntiGravityTarget = createGenericMdTarget({
  id: 'antigravity',
  name: 'AntiGravity',
  configDir: '.antigravity',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * JetBrains Junie — AI coding assistant.
 * Config: .junie/rules/*.md
 */
export const JunieTarget = createGenericMdTarget({
  id: 'junie',
  name: 'Junie',
  configDir: '.junie',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * Augment Code — AI coding assistant.
 * Config: .augmentcode/rules/*.md
 */
export const AugmentCodeTarget = createGenericMdTarget({
  id: 'augmentcode',
  name: 'Augment Code',
  configDir: '.augmentcode',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * Windsurf — AI coding IDE.
 * Config: .windsurf/rules/*.md, .windsurfrules
 */
export const WindsurfTarget = createGenericMdTarget({
  id: 'windsurf',
  name: 'Windsurf',
  configDir: '.windsurf',
  supportedFeatures: ['rules', 'mcp', 'ignore'],
  ignoreFile: '.windsurfignore',
  mcpInConfigDir: true,
});

/**
 * Warp — AI-native terminal.
 * Config: .warp/rules/*.md
 */
export const WarpTarget = createGenericMdTarget({
  id: 'warp',
  name: 'Warp',
  configDir: '.warp',
  supportedFeatures: ['rules'],
});

/**
 * Replit Agent — cloud IDE AI.
 * Config: .replit/rules/*.md
 */
export const ReplitTarget = createGenericMdTarget({
  id: 'replit',
  name: 'Replit Agent',
  configDir: '.replit',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});

/**
 * Zed — high-performance editor with AI.
 * Config: .zed/rules/*.md
 */
export const ZedTarget = createGenericMdTarget({
  id: 'zed',
  name: 'Zed',
  configDir: '.zed',
  supportedFeatures: ['rules', 'mcp'],
  mcpInConfigDir: true,
});
