/**
 * @file src/js/colorPicker.js
 * @description Manages the color selection functionality for the Canvas Drawing Board.
 *              Provides an interface to interact with an HTML color input and
 *              notifies subscribers of color changes.
 */

/**
 * Represents a ColorPicker component that manages color selection from an HTML input.
 */
class ColorPicker {
    /**
     * The HTML input element for color selection.
     * @private
     * @type {HTMLInputElement | null}
     */
    #colorInput = null;

    /**
     * The currently selected color in HEX format.
     * @private
     * @type {string}
     */
    #currentColor = '#000000'; // Default to black

    /**
     * Callback function to be executed when the color changes.
     * @private
     * @type {((color: string) => void) | null}
     */
    #changeCallback = null;

    /**
     * Binds the event handler to the instance.
     * @private
     * @type {EventListener}
     */
    #boundHandleColorChange;

    /**
     * Creates an instance of ColorPicker.
     * @param {string} inputElementId The ID of the HTML input element (type="color") to control.
     * @param {string} [initialColor='#000000'] The initial color to set for the picker.
     */
    constructor(inputElementId, initialColor = '#000000') {
        this.#colorInput = document.getElementById(inputElementId);
        if (!this.#colorInput || !(this.#colorInput instanceof HTMLInputElement) || this.#colorInput.type !== 'color') {
            console.error(`ColorPicker: Element with ID "${inputElementId}" not found or is not a color input.`);
            throw new Error('Invalid color input element provided.');
        }

        this.#currentColor = initialColor;
        this.#colorInput.value = initialColor;

        // Bind the event handler once to ensure 'this' context is correct
        this.#boundHandleColorChange = this.#handleColorChange.bind(this);
    }

    /**
     * Initializes the color picker by attaching event listeners.
     */
    init() {
        if (this.#colorInput) {
            this.#colorInput.addEventListener('input', this.#boundHandleColorChange);
            // Also listen to 'change' for final value, 'input' gives real-time updates
            this.#colorInput.addEventListener('change', this.#boundHandleColorChange);
        }
    }

    /**
     * Handles the 'input' and 'change' events from the color input element.
     * Updates the internal current color and invokes the change callback if set.
     * @private
     * @param {Event} event The DOM event object.
     */
    #handleColorChange(event) {
        const newColor = event.target.value;
        if (newColor !== this.#currentColor) {
            this.#currentColor = newColor;
            if (this.#changeCallback) {
                this.#changeCallback(this.#currentColor);
            }
        }
    }

    /**
     * Gets the currently selected color.
     * @returns {string} The current color in HEX format (e.g., '#RRGGBB').
     */
    getColor() {
        return this.#currentColor;
    }

    /**
     * Sets the color programmatically.
     * @param {string} hexColor The color to set in HEX format (e.g., '#RRGGBB').
     * @returns {boolean} True if the color was set successfully, false otherwise.
     */
    setColor(hexColor) {
        // Basic validation for HEX color format
        const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
        if (!hexRegex.test(hexColor)) {
            console.warn(`ColorPicker: Invalid HEX color format provided: ${hexColor}`);
            return false;
        }

        if (this.#colorInput) {
            this.#colorInput.value = hexColor;
            this.#currentColor = hexColor;
            if (this.#changeCallback) {
                this.#changeCallback(this.#currentColor);
            }
            return true;
        }
        return false;
    }

    /**
     * Registers a callback function to be called when the color changes.
     * @param {(color: string) => void} callback The function to call with the new color (HEX string) as an argument.
     */
    onChange(callback) {
        if (typeof callback === 'function') {
            this.#changeCallback = callback;
        } else {
            console.error('ColorPicker: onChange expects a function as an argument.');
        }
    }

    /**
     * Cleans up event listeners to prevent memory leaks.
     */
    destroy() {
        if (this.#colorInput) {
            this.#colorInput.removeEventListener('input', this.#boundHandleColorChange);
            this.#colorInput.removeEventListener('change', this.#boundHandleColorChange);
        }
        this.#colorInput = null;
        this.#changeCallback = null;
    }
}

// Export the ColorPicker class for use in other modules
export { ColorPicker };