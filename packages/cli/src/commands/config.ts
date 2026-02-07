/**
 * trmnl config - Manage CLI configuration
 */

import type { CAC } from 'cac';
import { CONFIG_PATH, getConfigValue, loadConfig, setConfigValue } from '../lib/config.ts';

export function registerConfigCommand(cli: CAC): void {
  // Config get
  cli
    .command('config get <key>', 'Get a config value')
    .example('trmnl config get webhook')
    .example('trmnl config get tier')
    .action((key: string) => {
      const value = getConfigValue(key);
      if (value !== undefined) {
        console.log(value);
      } else {
        console.log(`(not set)`);
      }
    });

  // Config set
  cli
    .command('config set <key> <value>', 'Set a config value')
    .example('trmnl config set webhook "https://trmnl.com/api/custom_plugins/..."')
    .example('trmnl config set tier plus')
    .action((key: string, value: string) => {
      setConfigValue(key, value);
      console.log(`✓ Set ${key} = ${value}`);
    });

  // Config list
  cli
    .command('config list', 'List all config values')
    .alias('config')
    .action(() => {
      const config = loadConfig();
      
      console.log(`Config file: ${CONFIG_PATH}`);
      console.log('');
      
      if (config.webhook) {
        console.log('[webhook]');
        console.log(`  url  = ${config.webhook.url || '(not set)'}`);
        console.log(`  tier = ${config.webhook.tier || 'free'}`);
      } else {
        console.log('[webhook]');
        console.log('  (not configured)');
      }
      
      console.log('');
      
      if (config.history) {
        console.log('[history]');
        console.log(`  path      = ${config.history.path || '~/.trmnl/history.jsonl'}`);
        console.log(`  maxSizeMb = ${config.history.maxSizeMb || 100}`);
      } else {
        console.log('[history]');
        console.log('  path      = ~/.trmnl/history.jsonl (default)');
        console.log('  maxSizeMb = 100 (default)');
      }
      
      console.log('');
      console.log('Environment:');
      console.log(`  TRMNL_WEBHOOK = ${process.env.TRMNL_WEBHOOK || '(not set)'}`);
    });

  // Config path (show config file location)
  cli
    .command('config path', 'Show config file path')
    .action(() => {
      console.log(CONFIG_PATH);
    });
}
