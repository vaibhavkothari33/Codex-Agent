// Cost tracking for API calls across a CLI session
// Supports OpenAI usage metadata; Gemini usage is currently not exposed

import chalk from 'chalk';

// Prices in USD per 1K tokens (adjust as needed)
// Reference: keep these configurable if pricing changes
const MODEL_PRICING = {
  // input, output per 1K tokens
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
};

const sessionTotalsById = new Map();

export function initSessionTotals(sessionId) {
  if (!sessionTotalsById.has(sessionId)) {
    sessionTotalsById.set(sessionId, {
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      items: [],
    });
  }
}

export function recordOpenAIUsage(sessionId, model, usage, meta = {}) {
  if (!sessionId || !usage) return;
  initSessionTotals(sessionId);
  const totals = sessionTotalsById.get(sessionId);

  const inputTokens = usage.prompt_tokens ?? 0;
  const outputTokens = usage.completion_tokens ?? 0;
  const pricing = MODEL_PRICING[model] ?? { input: 0, output: 0 };
  const cost = (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output;

  totals.calls += 1;
  totals.inputTokens += inputTokens;
  totals.outputTokens += outputTokens;
  totals.costUsd += cost;
  totals.items.push({ provider: 'openai', model, inputTokens, outputTokens, cost, meta });
}

export function recordGeminiCall(sessionId, meta = {}) {
  // Gemini JS client does not expose token usage consistently; record counts only
  initSessionTotals(sessionId);
  const totals = sessionTotalsById.get(sessionId);
  totals.calls += 1;
  totals.items.push({ provider: 'gemini', model: 'gemini-2.5-flash', inputTokens: 0, outputTokens: 0, cost: 0, meta });
}

export function getSessionTotals(sessionId) {
  initSessionTotals(sessionId);
  return sessionTotalsById.get(sessionId);
}

export function printLastCallSummary(sessionId) {
  const totals = getSessionTotals(sessionId);
  const last = totals.items[totals.items.length - 1];
  if (!last) return;
  const providerLabel = last.provider === 'openai' ? 'OpenAI' : 'Gemini';
  console.log(chalk.gray(`   ${providerLabel} usage → input: ${last.inputTokens}, output: ${last.outputTokens}, cost: $${last.cost.toFixed(4)}`));
}

export function printSessionTotals(sessionId) {
  const totals = getSessionTotals(sessionId);
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.cyan('💳 API Cost Summary (this session)'));
  console.log(chalk.white(`   Calls: ${totals.calls}`));
  console.log(chalk.white(`   Tokens → input: ${totals.inputTokens}, output: ${totals.outputTokens}`));
  console.log(chalk.white(`   Estimated cost: $${totals.costUsd.toFixed(4)}`));
}


