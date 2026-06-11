```javascript
import { getMousePos } from './utils.js';

/**
 * @typedef {object} DrawingState
 * @property {string} color - The current drawing color (e.g., '#000000').
 * @property {number} lineWidth - The current line width in pixels.
 * @property {boolean} fillShape - Whether shapes should be filled or just stroked.
 * @property {string} currentTool - The name of the currently active tool.
 * @property {Function} saveStateForUndo - A callback to save the canvas state for undo/redo.
 */

/**
 * Base Tool class providing common structure and methods for all drawing tools.
 * All specific tools should extend this class.
 */
class Tool {