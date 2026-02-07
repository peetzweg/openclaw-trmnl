/**
 * Webhook sending logic
 */

import { getTier, getWebhookUrl } from './config.ts';
import { logEntry } from './logger.ts';
import { validatePayload } from './validator.ts';
import type { HistoryEntry, WebhookPayload } from '../types.ts';

export interface SendResult {
  success: boolean;
  statusCode?: number;
  response?: string;
  error?: string;
  durationMs: number;
  validation: ReturnType<typeof validatePayload>;
}

/**
 * Send payload to TRMNL webhook
 */
export async function sendToWebhook(
  payload: WebhookPayload,
  options: { skipValidation?: boolean; skipLog?: boolean; webhookUrl?: string } = {}
): Promise<SendResult> {
  const startTime = Date.now();
  const tier = getTier();
  
  // Validate payload
  const validation = validatePayload(payload, tier);
  
  if (!options.skipValidation && !validation.valid) {
    const durationMs = Date.now() - startTime;
    const result: SendResult = {
      success: false,
      error: validation.errors.join('; '),
      durationMs,
      validation,
    };
    
    // Log failed validation
    if (!options.skipLog) {
      logEntry(createHistoryEntry(payload, result, tier));
    }
    
    return result;
  }
  
  // Get webhook URL
  const webhookUrl = options.webhookUrl || getWebhookUrl();
  
  if (!webhookUrl) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: 'No webhook URL configured. Set TRMNL_WEBHOOK env var or run: trmnl config set webhook <url>',
      durationMs,
      validation,
    };
  }
  
  // Send request
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const durationMs = Date.now() - startTime;
    const responseText = await response.text();
    
    const result: SendResult = {
      success: response.ok,
      statusCode: response.status,
      response: responseText,
      durationMs,
      validation,
    };
    
    if (!response.ok) {
      result.error = `HTTP ${response.status}: ${responseText}`;
    }
    
    // Log the send
    if (!options.skipLog) {
      logEntry(createHistoryEntry(payload, result, tier));
    }
    
    return result;
    
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const error = err instanceof Error ? err.message : 'Unknown error';
    
    const result: SendResult = {
      success: false,
      error,
      durationMs,
      validation,
    };
    
    // Log the error
    if (!options.skipLog) {
      logEntry(createHistoryEntry(payload, result, tier));
    }
    
    return result;
  }
}

/**
 * Create a history entry from send result
 */
function createHistoryEntry(
  payload: WebhookPayload,
  result: SendResult,
  tier: ReturnType<typeof getTier>
): HistoryEntry {
  return {
    timestamp: new Date().toISOString(),
    size_bytes: result.validation.size_bytes,
    tier,
    payload,
    success: result.success,
    status_code: result.statusCode,
    response: result.response,
    error: result.error,
    duration_ms: result.durationMs,
  };
}
