import { fileTools } from './fileTools.js';
import { systemTools } from './systemTools.js';
import { utilityTools } from './utilityTools.js';

// Combine all tools into a single map
export const TOOLS_MAP = {
    ...fileTools,
    ...systemTools,
    ...utilityTools
};