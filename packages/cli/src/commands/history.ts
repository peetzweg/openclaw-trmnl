/**
 * trmnl history - View send history
 */

import type { CAC } from 'cac';
import { HISTORY_PATH } from '../lib/config.ts';
import { formatEntry, getHistory, getHistoryStats, type HistoryFilter } from '../lib/logger.ts';

interface HistoryOptions {
  last?: number;
  today?: boolean;
  failed?: boolean;
  success?: boolean;
  json?: boolean;
  verbose?: boolean;
}

export function registerHistoryCommand(cli: CAC): void {
  cli
    .command('history', 'View send history')
    .option('-n, --last <n>', 'Show last N entries', { default: 10 })
    .option('--today', 'Show only today\'s entries')
    .option('--failed', 'Show only failed sends')
    .option('--success', 'Show only successful sends')
    .option('--json', 'Output as JSON')
    .option('-v, --verbose', 'Show content preview')
    .example('trmnl history')
    .example('trmnl history --last 20')
    .example('trmnl history --today --failed')
    .action((options: HistoryOptions) => {
      const filter: HistoryFilter = {
        last: options.last,
        today: options.today,
        failed: options.failed,
        success: options.success,
      };

      const entries = getHistory(filter);

      if (options.json) {
        console.log(JSON.stringify(entries, null, 2));
        return;
      }

      if (entries.length === 0) {
        console.log('No history entries found.');
        console.log(`History file: ${HISTORY_PATH}`);
        return;
      }

      // Stats header
      const stats = getHistoryStats();
      if (stats) {
        console.log(`History: ${stats.entries} total entries (${stats.sizeMb} MB)`);
        console.log('');
      }

      // Filter description
      const filterParts: string[] = [];
      if (options.today) filterParts.push('today');
      if (options.failed) filterParts.push('failed');
      if (options.success) filterParts.push('success');
      if (filterParts.length > 0) {
        console.log(`Filter: ${filterParts.join(', ')}`);
        console.log('');
      }

      // Entries
      console.log(`Showing ${entries.length} entries (most recent first):`);
      console.log('');

      for (const entry of entries) {
        console.log(formatEntry(entry, options.verbose));
      }
    });

  // History clear
  cli
    .command('history clear', 'Clear send history')
    .option('--confirm', 'Confirm deletion')
    .action((options: { confirm?: boolean }) => {
      if (!options.confirm) {
        console.log('This will delete all history. Use --confirm to proceed.');
        console.log(`History file: ${HISTORY_PATH}`);
        return;
      }

      const fs = require('node:fs');
      try {
        fs.unlinkSync(HISTORY_PATH);
        console.log('✓ History cleared');
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          console.log('History file does not exist.');
        } else {
          console.error('Error clearing history:', err);
        }
      }
    });

  // History stats
  cli
    .command('history stats', 'Show history statistics')
    .action(() => {
      const stats = getHistoryStats();
      
      if (!stats) {
        console.log('No history file found.');
        return;
      }

      const entries = getHistory({});
      const successCount = entries.filter(e => e.success).length;
      const failedCount = entries.filter(e => !e.success).length;
      const totalBytes = entries.reduce((sum, e) => sum + e.size_bytes, 0);
      const avgBytes = entries.length > 0 ? Math.round(totalBytes / entries.length) : 0;
      const avgDuration = entries.length > 0 
        ? Math.round(entries.reduce((sum, e) => sum + e.duration_ms, 0) / entries.length) 
        : 0;

      console.log('History Statistics');
      console.log('');
      console.log(`File:     ${HISTORY_PATH}`);
      console.log(`Size:     ${stats.sizeMb} MB`);
      console.log('');
      console.log(`Total:    ${entries.length} sends`);
      console.log(`Success:  ${successCount} (${Math.round(successCount / entries.length * 100)}%)`);
      console.log(`Failed:   ${failedCount} (${Math.round(failedCount / entries.length * 100)}%)`);
      console.log('');
      console.log(`Avg size:     ${avgBytes} bytes`);
      console.log(`Avg duration: ${avgDuration}ms`);

      // Recent activity
      const today = getHistory({ today: true });
      const thisWeek = getHistory({ since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });
      console.log('');
      console.log(`Today:     ${today.length} sends`);
      console.log(`This week: ${thisWeek.length} sends`);
    });
}
