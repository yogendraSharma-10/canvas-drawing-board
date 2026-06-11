import {
    drawBrush,
    drawRectangle,
    drawCircle,
    erase
} from './tools.js';
import {
    initColorPicker
} from './colorPicker.js';
import {
    saveCanvasAsImage,
    clearCanvas
} from './utils.js';

// --- DOM Elements ---
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');
const colorPickerContainer = document.getElementById('colorPicker');
const brushSizeSlider = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const undoBtn = document.getElementById('