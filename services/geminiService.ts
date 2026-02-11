
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

// Use localStorage to persist cache across refreshes
const CACHE_KEY = 'upbo_ai_cache_v1'; // Rebrand
const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours for static content

// Global rate limit cooldown timestamp
let rateLimitCooldownUntil = 0;

/**
 * Utility to extract JSON from a potential markdown-wrapped response
 */
function extractJson(text: string) {
  if (!text) return null;
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to find array or object in text
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerError) {
        console.warn("Failed to parse extracted JSON content.", text);
        return null;
      }
    }
    console.warn("No valid JSON found in response.", text);
    return null;
  }
}

function getPersistentCache(): Record<string, { data: any; timestamp: number }> {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const filtered: Record<string, any> = {};
      let changed = false;
      for (const [key, value] of Object.entries(parsed)) {
        if (now - (value as any).timestamp < 86400000) { 
          filtered[key] = value;
        } else {
          changed = true;
        }
      }
      if (changed) localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
      return filtered;
    }
  } catch (e) {
    console.warn('Cache access error', e);
  }
  return {};
}

function saveToPersistentCache(key: string, data: any) {
  try {
    const cache = getPersistentCache();
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Cache save error', e);
  }
}

const pendingRequests: Record<string, Promise<any>> = {};

function isRateLimitError(error: any): boolean {
  return error?.message === 'QUOTA_COOLDOWN' || 
         error?.status === 429 || 
         error?.code === 429 || 
         (typeof error?.message === 'string' && (
            error.message.includes('429') || 
            error.message.includes('quota') || 
            error.message.includes('resource_exhausted')
         ));
}

function isInvalidKeyError(error: any): boolean {
  const msg = (error?.message || '').toString();
  return msg.includes('API key not valid') || 
         msg.includes('API_KEY_INVALID') ||
         (error?.status === 400 && msg.includes('API key'));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1, delay = 2000): Promise<T> {
  const now = Date.now();
  if (now < rateLimitCooldownUntil) {
    throw new Error('QUOTA_COOLDOWN');
  }

  try {
    return await fn();
  } catch (error: any) {
    if (isInvalidKeyError(error)) {
      console.error("Invalid API Key detected, requesting reset...");
      window.dispatchEvent(new Event('upbot-invalid-api-key'));
      throw error;
    }

    if (isRateLimitError(error)) {
      console.warn("Rate limit hit, cooling down...");
      rateLimitCooldownUntil = Date.now() + 10000; // 10s cooldown
      
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
      }
    }
    throw error;
  }
}

async function deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (pendingRequests[key]) return pendingRequests[key];
  const promise = fn().finally(() => { delete pendingRequests[key]; });
  pendingRequests[key] = promise;
  return promise;
}

// --- API Functions ---

export function createChatSession(): Chat {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use Flash for faster chat interactions
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are UPBOTRADING Assistant, an AI financial expert for UPBO. Provide concise, data-driven answers about Vietnam stock market (HOSE, HNX, UPCOM). When asked about prices or news, ALWAYS use Google Search to get the latest data.',
      tools: [{ googleSearch: {} }],
    },
  });
}

export async function getInsightSummary(insightTitle: string, lang: 'en' | 'vn' | 'zh' = 'en') {
  const cacheKey = `summary_${insightTitle}_${lang}`;
  const cache = getPersistentCache();
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) return cache[cacheKey].data;

  return deduplicate(cacheKey, async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const langMap = { en: 'English', vn: 'Vietnamese', zh: 'Simplified Chinese' };
      
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a 2-sentence investment summary in ${langMap[lang]} for the topic: "${insightTitle}".`,
        config: { temperature: 0.5 }
      }));
      
      const text = response.text || "Summary unavailable.";
      saveToPersistentCache(cacheKey, text);
      return text;
    } catch (error) {
      if (isRateLimitError(error)) return cache[cacheKey]?.data || "Summary temporarily unavailable.";
      return cache[cacheKey]?.data || "...";
    }
  });
}

export async function getLiveMarketPrices(symbols: string[]) {
  // Short cache TTL for live prices (e.g., 2 minutes) to allow refreshing
  const cacheKey = `live_prices_v4_${symbols.sort().join('_')}`;
  const cache = getPersistentCache();
  const now = Date.now();
  
  // If we have very recent data (under 2 mins), use it to save tokens
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < 120000) return cache[cacheKey].data;

  return deduplicate(cacheKey, async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Use Search Grounding to get real prices
      const prompt = `Find the current real-time stock price (in VND x1000) and Market Capitalization (in Billion VND) for these Vietnam stocks: ${symbols.join(', ')}. 
      Prioritize sources like SSI iBoard, Vietstock, CafeF.
      Return strictly a JSON object where keys are symbols and values are objects with "price" (number) and "marketCap" (string, formatted e.g. "159K B" or "159,000 B").
      Example: {"VNM": {"price": 76.5, "marketCap": "159,000 B"}, "HPG": {"price": 28.1, "marketCap": "163,000 B"}}
      `;

      // NOTE: Removed responseMimeType: "application/json" because it conflicts with search tools in some contexts or when output is grounded text.
      // We manually extract JSON instead.
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }]
        }
      }));

      const data = extractJson(response.text || "{}") || {};
      
      // Extract sources
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      }).filter(Boolean) || [];

      const result = { prices: data, sources };
      saveToPersistentCache(cacheKey, result);
      return result;
    } catch (error: any) {
      if (isRateLimitError(error)) {
        console.warn("Gemini API Rate Limit (Prices): Using cached data.");
        return cache[cacheKey]?.data || { prices: {}, sources: [] };
      }
      console.error("Gemini API Error (Prices):", error);
      return cache[cacheKey]?.data || { prices: {}, sources: [] };
    }
  });
}

export async function getMarketUpdate(lang: 'en' | 'vn' | 'zh' = 'en') {
  const cacheKey = `market_update_v2_${lang}`;
  const cache = getPersistentCache();
  // Cache for 30 mins
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < 1800000)) return cache[cacheKey].data;

  return deduplicate(cacheKey, async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompts = {
        en: "Summarize the latest trading session of Vietnam Stock Market (VN-Index) in 3 bullet points.",
        vn: "Tóm tắt diễn biến phiên giao dịch mới nhất của thị trường chứng khoán Việt Nam (VN-Index) trong 3 gạch đầu dòng ngắn gọn.",
        zh: "用 3 個要點總結越南股市 (VN-Index) 的最新交易時段。"
      };
      
      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompts[lang],
        config: { tools: [{ googleSearch: {} }] }
      }));

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      }).filter(Boolean) || [];

      const data = { content: response.text, sources };
      saveToPersistentCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isRateLimitError(error)) return cache[cacheKey]?.data || { content: null, sources: [] };
      return cache[cacheKey]?.data || { content: null, sources: [] };
    }
  });
}

export async function getSymbolAnalysis(symbol: string, currentPrice: string, lang: 'en' | 'vn' | 'zh' = 'en') {
  const cacheKey = `analysis_v2_${symbol}_${lang}`;
  const cache = getPersistentCache();
  // Analysis valid for 1 hour
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < 3600000)) return cache[cacheKey].data;

  return deduplicate(cacheKey, async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze Vietnam stock "${symbol}" (Price: ${currentPrice}). 
      Use Google Search to find recent news and financial drivers.
      Return a response with exactly these sections:
      1. **Sentiment**: [Bullish], [Bearish], or [Neutral].
      2. **News Summary**: A brief paragraph summarizing recent news.
      3. **Key Drivers**: 3 bullet points of key drivers.
      
      Language: ${lang === 'vn' ? 'Vietnamese' : 'English'}.`;

      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      }));

      let sentiment = 'Neutral';
      let content = response.text || '';
      
      // Extract sentiment tags like [Bullish]
      const match = content.match(/\[(Bullish|Bearish|Neutral|Tích cực|Tiêu cực|Trung lập)\]/i);
      if (match) {
        sentiment = match[1].replace('Tích cực', 'Bullish').replace('Tiêu cực', 'Bearish').replace('Trung lập', 'Neutral');
        content = content.replace(match[0], '').trim();
      }

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      }).filter(Boolean) || [];

      const data = { sentiment, content, sources, timestamp: new Date().toLocaleTimeString() };
      saveToPersistentCache(cacheKey, data);
      return data;
    } catch (error) {
      if (isRateLimitError(error)) return cache[cacheKey]?.data || { sentiment: 'Neutral', content: "Analysis delayed due to traffic.", sources: [], timestamp: '--:--' };
      return { sentiment: 'Neutral', content: "Analysis temporarily unavailable due to connectivity.", sources: [], timestamp: '--:--' };
    }
  });
}

export async function analyzeProductStrategy(productTitle: string, thesis: string, lang: 'en' | 'vn' | 'zh' = 'en') {
  const cacheKey = `prod_strat_${productTitle}_${lang}`;
  const cache = getPersistentCache();
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 86400000) return cache[cacheKey].data;

  return deduplicate(cacheKey, async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use Pro for complex reasoning
      const prompt = `Analyze this investment product: "${productTitle}" with thesis "${thesis}". 
      Explain its potential risks and rewards in ${lang === 'vn' ? 'Vietnamese' : 'English'}.
      Use Google Search to check if similar themes are trending globally.`;

      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      }));

      const data = { analysis: response.text, timestamp: new Date().toLocaleTimeString() };
      saveToPersistentCache(cacheKey, data);
      return data;
    } catch {
      return { analysis: "Deep analysis unavailable." };
    }
  });
}

export async function getQuickProductSummary(title: string, thesis: string, lang: 'en' | 'vn' | 'zh' = 'en') {
  return getInsightSummary(`${title}: ${thesis}`, lang);
}

export async function performGlobalSearch(query: string, lang: 'en' | 'vn' | 'zh' = 'en') {
  if (!query) return { results: [] };
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Use Flash for fast search results
    // Removed strict JSON mime type to avoid 400s with Search tool
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search for "${query}" related to finance/investing in Vietnam. 
        Return a JSON array of 3-4 items. Each item must have: "title", "category" (e.g. Stock, News, Concept), "link" (use a real URL if found via search, or # if generic), and "snippet".`,
        config: { 
            tools: [{ googleSearch: {} }],
        }
    }));

    const results = extractJson(response.text || "[]");
    return { results: Array.isArray(results) ? results : [] };
  } catch (e) {
    if (!isRateLimitError(e)) console.error("Search failed", e);
    return { results: [] };
  }
}

export async function getInsightSentiment(title: string, lang: 'en' | 'vn' | 'zh' = 'en') {
    return "Neutral"; // Placeholder to save tokens
}
export async function getSymbolsByGroup(group: string = 'VN30') {
    return []; // Placeholder
}
export async function getMarketListing(exchange: string) {
    return { components: [], sources: [] }; // Placeholder
}
