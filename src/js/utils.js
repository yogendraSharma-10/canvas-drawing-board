/**
 * src/js/utils.js
 *
 * Utility functions for the Canvas Drawing Board application.
 * This file provides common helper functions that can be used across different modules
 * to enhance functionality, improve performance, or simplify common tasks.
 */

/**
 * Calculates the mouse position relative to the canvas element.
 * This accounts for any scaling or positioning of the canvas on the page,
 * ensuring accurate coordinates regardless of CSS styling.
 *
 * @param {HTMLCanvasElement} canvas - The canvas DOM element.
 * @param {MouseEvent} event - The mouse event object (e.g., mousemove, mousedown).
 * @returns {{x: number, y: number}} An object containing the x and y coordinates relative to the canvas's top-left corner.
 */
export function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect(); // Get canvas size and position relative to the viewport
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

/**
 * Downloads the current content of the canvas as an image file.
 * The image format will be PNG by default.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element whose content is to be downloaded.
 * @param {string} [filename='drawing-board-image'] - The desired filename for the downloaded image (without extension).
 */
export function downloadCanvasAsImage(canvas, filename = 'drawing-board-image') {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    // Use toDataURL to get a data URI of the canvas content in PNG format.
    link.href = canvas.toDataURL('image/png');
    // Temporarily append the link to the document body to make it clickable.
    document.body.appendChild(link);
    // Programmatically click the link to trigger the download.
    link.click();
    // Clean up by removing the temporary link element.
    document.body.removeChild(link);
}

/**
 * Converts a hexadecimal color string to an RGBA string.
 * Supports both 3-digit (#RGB) and 6-digit (#RRGGBB) hex formats.
 *
 * @param {string} hex - The hexadecimal color string (e.g., "#RRGGBB", "RRGGBB", "#RGB", "RGB").
 * @param {number} [alpha=1] - The alpha transparency value (0 to 1). Defaults to 1 (fully opaque).
 * @returns {string} An RGBA color string (e.g., "rgba(255, 0, 0, 1)").
 * @throws {Error} If the provided hex string is not a valid hexadecimal color format.
 */
export function hexToRgba(hex, alpha = 1) {
    let c;
    // Validate hex format and remove '#' if present
    if (/^#?([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.startsWith('#') ? hex.substring(1) : hex;
        // Expand 3-digit hex to 6-digit
        if (c.length === 3) {
            c = c.split('').map(char => char + char).join('');
        }
        // Convert hex to integer and extract R, G, B components
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);

        // Ensure alpha is clamped between 0 and 1
        const clampedAlpha = Math.max(0, Math.min(1, alpha));

        return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
    }
    throw new Error(`Invalid Hex color format: ${hex}`);
}

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have passed since the last time the debounced function was invoked.
 * Useful for performance-critical events like window resizing, rapid input, or complex UI updates.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay before invoking `func`.
 * @returns {Function} The debounced function.
 */
export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout); // Clear any existing timeout
        timeout = setTimeout(() => func.apply(context, args), delay); // Set a new timeout
    };
}

/**
 * Clamps a numerical value between a specified minimum and maximum value.
 *
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {number} The clamped value, which will be within the [min, max] range.
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// --- Cross-Project Context ---
// While these utilities are client-side focused, in a microservice architecture,
// this `utils.js` file could also contain functions for interacting with other services.
// For example:
// - `uploadDrawingToStorage(canvas, userId)`: A function that sends the canvas data
//   to a shared image storage service (e.g., used by the In-Browser Code Editor for assets).
//   This would likely use a configured API endpoint, perhaps from a global `APP_CONFIG`
//   or an imported `API_ENDPOINTS` object.
// - `fetchSharedAssets(assetType)`: If the drawing board could load assets (e.g., templates, stickers)
//   from a shared asset management service, this utility would handle the API call.
//
// For this project, `downloadCanvasAsImage` keeps the functionality client-side,
// but future enhancements could integrate with a backend for persistent storage
// or sharing across the "Text-Based Adventure Game" or "In-Browser Code Editor" projects.
// Example of a potential integration point (commented out as it's not implemented):
/*
import { API_ENDPOINTS } from './config'; // Assuming a config file exists for API endpoints

export async function uploadDrawingToStorage(canvas, filename = 'drawing') {
    if (!API_ENDPOINTS || !API_ENDPOINTS.IMAGE_STORAGE_SERVICE) {
        console.warn('Image storage service endpoint not configured.');
        return;
    }
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('file', blob, `${filename}.png`);
        formData.append('metadata', JSON.stringify({
            source: 'CanvasDrawingBoard',
            user: 'current_user_id' // Placeholder for actual user ID
        }));

        const response = await fetch(API_ENDPOINTS.IMAGE_STORAGE_SERVICE, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Drawing uploaded successfully:', result);
        return result;
    } catch (error) {
        console.error('Error uploading drawing:', error);
        throw error;
    }
}
*/