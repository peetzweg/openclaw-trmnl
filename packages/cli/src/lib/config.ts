/**
 * Config file management for ~/.trmnl/config.toml
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import type { Config, WebhookTier } from '../types.ts';

/** Config directory path */
export const CONFIG_DIR = join(homedir(), '.trmnl');

/** Config file path */
export const CONFIG_PATH = join(CONFIG_DIR, 'config.toml');

/** History file path */
export const HISTORY_PATH = join(CONFIG_DIR, 'history.jsonl');

/**
 * Ensure ~/.trmnl directory exists
 */
export function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Simple TOML parser (handles our limited config format)
 */
function parseTOML(content: string): Config {
  const config: Config = {};
  let currentSection: string | null = null;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Section header
    const sectionMatch = trimmed.match(/^\[(\w+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (currentSection === 'webhook') config.webhook = {};
      if (currentSection === 'history') config.history = {};
      continue;
    }
    
    // Key-value pair
    const kvMatch = trimmed.match(/^(\w+)\s*=\s*"?([^"]*)"?$/);
    if (kvMatch && currentSection) {
      const [, key, value] = kvMatch;
      if (currentSection === 'webhook' && config.webhook) {
        if (key === 'url') config.webhook.url = value;
        if (key === 'tier') config.webhook.tier = value as WebhookTier;
      }
      if (currentSection === 'history' && config.history) {
        if (key === 'path') config.history.path = value;
        if (key === 'maxSizeMb') config.history.maxSizeMb = parseInt(value, 10);
      }
    }
  }

  return config;
}

/**
 * Serialize config to TOML format
 */
function serializeTOML(config: Config): string {
  const lines: string[] = [];

  if (config.webhook) {
    lines.push('[webhook]');
    if (config.webhook.url) lines.push(`url = "${config.webhook.url}"`);
    if (config.webhook.tier) lines.push(`tier = "${config.webhook.tier}"`);
    lines.push('');
  }

  if (config.history) {
    lines.push('[history]');
    if (config.history.path) lines.push(`path = "${config.history.path}"`);
    if (config.history.maxSizeMb !== undefined) lines.push(`maxSizeMb = ${config.history.maxSizeMb}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Load config from file
 */
export function loadConfig(): Config {
  ensureConfigDir();
  
  if (!existsSync(CONFIG_PATH)) {
    return {};
  }

  try {
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    return parseTOML(content);
  } catch {
    return {};
  }
}

/**
 * Save config to file
 */
export function saveConfig(config: Config): void {
  ensureConfigDir();
  const content = serializeTOML(config);
  writeFileSync(CONFIG_PATH, content, 'utf-8');
}

/**
 * Get a specific config value
 */
export function getConfigValue(key: string): string | undefined {
  const config = loadConfig();
  
  if (key === 'webhook' || key === 'webhook.url') {
    return config.webhook?.url;
  }
  if (key === 'webhook.tier' || key === 'tier') {
    return config.webhook?.tier;
  }
  if (key === 'history.path') {
    return config.history?.path;
  }
  if (key === 'history.maxSizeMb') {
    return config.history?.maxSizeMb?.toString();
  }
  
  return undefined;
}

/**
 * Set a specific config value
 */
export function setConfigValue(key: string, value: string): void {
  const config = loadConfig();
  
  if (key === 'webhook' || key === 'webhook.url') {
    config.webhook = config.webhook || {};
    config.webhook.url = value;
  } else if (key === 'webhook.tier' || key === 'tier') {
    config.webhook = config.webhook || {};
    config.webhook.tier = value as WebhookTier;
  } else if (key === 'history.path') {
    config.history = config.history || {};
    config.history.path = value;
  } else if (key === 'history.maxSizeMb') {
    config.history = config.history || {};
    config.history.maxSizeMb = parseInt(value, 10);
  }
  
  saveConfig(config);
}

/**
 * Get webhook URL from config or environment
 */
export function getWebhookUrl(): string | undefined {
  // Environment variable takes precedence
  const envUrl = process.env.TRMNL_WEBHOOK;
  if (envUrl) return envUrl;
  
  // Fall back to config
  return getConfigValue('webhook.url');
}

/**
 * Get tier from config (default: free)
 */
export function getTier(): WebhookTier {
  const tier = getConfigValue('tier');
  if (tier === 'plus') return 'plus';
  return 'free';
}
