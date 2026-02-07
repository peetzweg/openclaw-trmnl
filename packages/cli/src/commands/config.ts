/**
 * trmnl config - Manage CLI configuration
 * trmnl plugin - Manage webhook plugins
 */

import type { CAC } from 'cac';
import {
  CONFIG_PATH,
  getTier,
  listPlugins,
  loadConfig,
  removePlugin,
  setDefaultPlugin,
  setPlugin,
  setTier,
} from '../lib/config.ts';
import { getHistoryPath } from '../lib/logger.ts';
import type { WebhookTier } from '../types.ts';

export function registerConfigCommand(cli: CAC): void {
  // Config show
  cli
    .command('config', 'Show configuration')
    .action(() => {
      const config = loadConfig();
      const plugins = listPlugins();

      console.log(`Config file: ${CONFIG_PATH}`);
      console.log('');

      console.log('Plugins:');
      if (plugins.length === 0) {
        console.log('  (none configured)');
        console.log('');
        console.log('  Add a plugin:');
        console.log('    trmnl plugin add <name> <url>');
      } else {
        for (const { name, plugin, isDefault } of plugins) {
          const defaultMark = isDefault ? ' (default)' : '';
          console.log(`  ${name}${defaultMark}`);
          console.log(`    url: ${plugin.url}`);
          if (plugin.description) {
            console.log(`    desc: ${plugin.description}`);
          }
        }
      }

      console.log('');
      console.log(`Tier: ${config.tier || 'free'}`);
      console.log(`  Limit: ${config.tier === 'plus' ? '5 KB' : '2 KB'}`);

      console.log('');
      console.log('History:');
      console.log(`  path: ${getHistoryPath()}`);

      console.log('');
      console.log('Environment:');
      console.log(`  TRMNL_WEBHOOK: ${process.env.TRMNL_WEBHOOK || '(not set)'}`);
    });

  // Tier command (separate from config)
  cli
    .command('tier [value]', 'Get or set tier (free or plus)')
    .example('trmnl tier         # Show current tier')
    .example('trmnl tier plus    # Set to plus')
    .example('trmnl tier free    # Set to free')
    .action((value?: string) => {
      if (!value) {
        const tier = getTier();
        console.log(`Tier: ${tier}`);
        console.log(`Limit: ${tier === 'plus' ? '5 KB (5,120 bytes)' : '2 KB (2,048 bytes)'}`);
        return;
      }

      if (value !== 'free' && value !== 'plus') {
        console.error('Invalid tier. Use "free" or "plus".');
        process.exit(1);
      }

      setTier(value as WebhookTier);
      console.log(`✓ Tier set to: ${value}`);
    });

  // Plugin command with action as first arg
  cli
    .command('plugin [action] [name] [url]', 'Manage webhook plugins')
    .option('-d, --desc <description>', 'Plugin description')
    .option('-u, --url <url>', 'Webhook URL (for set action)')
    .option('--default', 'Set as default plugin')
    .example('trmnl plugin                     # List plugins')
    .example('trmnl plugin add home <url>      # Add plugin')
    .example('trmnl plugin rm home             # Remove plugin')
    .example('trmnl plugin default home        # Set default')
    .example('trmnl plugin set home --url ...  # Update plugin')
    .action((action?: string, name?: string, url?: string, options?: { desc?: string; url?: string; default?: boolean }) => {
      // No action = list
      if (!action) {
        showPluginList();
        return;
      }

      // Handle actions
      switch (action) {
        case 'add':
          if (!name || !url) {
            console.error('Usage: trmnl plugin add <name> <url>');
            process.exit(1);
          }
          setPlugin(name, url, options?.desc);
          console.log(`✓ Added plugin: ${name}`);
          if (options?.default) {
            setDefaultPlugin(name);
            console.log(`✓ Set as default`);
          }
          break;

        case 'rm':
        case 'remove':
          if (!name) {
            console.error('Usage: trmnl plugin rm <name>');
            process.exit(1);
          }
          if (removePlugin(name)) {
            console.log(`✓ Removed plugin: ${name}`);
          } else {
            console.error(`Plugin not found: ${name}`);
            process.exit(1);
          }
          break;

        case 'default':
          if (!name) {
            console.error('Usage: trmnl plugin default <name>');
            process.exit(1);
          }
          if (setDefaultPlugin(name)) {
            console.log(`✓ Default plugin: ${name}`);
          } else {
            console.error(`Plugin not found: ${name}`);
            process.exit(1);
          }
          break;

        case 'set':
        case 'update':
          if (!name) {
            console.error('Usage: trmnl plugin set <name> [options]');
            process.exit(1);
          }
          const plugins = listPlugins();
          const existing = plugins.find(p => p.name === name);
          if (!existing) {
            console.error(`Plugin not found: ${name}`);
            process.exit(1);
          }
          const newUrl = options?.url || existing.plugin.url;
          const newDesc = options?.desc !== undefined ? options.desc : existing.plugin.description;
          setPlugin(name, newUrl, newDesc);
          console.log(`✓ Updated plugin: ${name}`);
          break;

        case 'list':
          showPluginList();
          break;

        default:
          console.error(`Unknown action: ${action}`);
          console.log('');
          console.log('Available actions:');
          console.log('  add <name> <url>  - Add a plugin');
          console.log('  rm <name>         - Remove a plugin');
          console.log('  default <name>    - Set default plugin');
          console.log('  set <name>        - Update a plugin');
          console.log('  list              - List all plugins');
          process.exit(1);
      }
    });

  // Plugins alias for list
  cli
    .command('plugins', 'List all plugins')
    .action(() => {
      showPluginList();
    });
}

function showPluginList(): void {
  const plugins = listPlugins();

  if (plugins.length === 0) {
    console.log('No plugins configured.');
    console.log('');
    console.log('Add a plugin:');
    console.log('  trmnl plugin add <name> <url>');
    return;
  }

  console.log('Plugins:');
  for (const { name, plugin, isDefault } of plugins) {
    const defaultMark = isDefault ? ' ★' : '';
    console.log(`  ${name}${defaultMark}`);
    console.log(`    ${plugin.url}`);
    if (plugin.description) {
      console.log(`    ${plugin.description}`);
    }
  }

  console.log('');
  console.log('★ = default plugin');
}
