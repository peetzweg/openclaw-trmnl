#!/usr/bin/env bun
/**
 * trmnl-cli - CLI tool for TRMNL e-ink displays
 * 
 * Commands:
 *   trmnl send       - Send content to TRMNL display
 *   trmnl validate   - Validate payload without sending
 *   trmnl config     - Manage CLI configuration
 *   trmnl history    - View send history
 */

import cac from 'cac';
import { registerConfigCommand } from './commands/config.ts';
import { registerHistoryCommand } from './commands/history.ts';
import { registerSendCommand } from './commands/send.ts';
import { registerValidateCommand } from './commands/validate.ts';

const cli = cac('trmnl');

// Version from package.json
cli.version('0.1.0');

// Register commands
registerSendCommand(cli);
registerValidateCommand(cli);
registerConfigCommand(cli);
registerHistoryCommand(cli);

// Help text
cli.help();

// Default action (no command)
cli.command('').action(() => {
  cli.outputHelp();
});

// Parse and run
cli.parse();
