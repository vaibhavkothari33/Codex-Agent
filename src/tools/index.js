import { fileTools } from './fileTools.js';
import { systemTools } from './systemTools.js';
import { utilityTools } from './utilityTools.js';
import { webScrapingTools } from './webScrapingTools.js';
import { reactTools } from './reactTools.js';
import { gitTools } from './gitTools.js';

// Combine all tools into a single map
export const TOOLS_MAP = {
    ...fileTools,
    ...systemTools,
    ...utilityTools,
    ...webScrapingTools,
    ...reactTools,
    ...gitTools
};