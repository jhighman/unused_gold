// src/jobs/Context.js

class Context {
    constructor() {
        this.data = {};
    }

    /**
     * Sets a value in the context.
     * @param {string} key - The key under which to store the value.
     * @param {*} value - The value to store.
     */
    set(key, value) {
        this.data[key] = value;
    }

    /**
     * Gets a value from the context.
     * @param {string} key - The key of the value to retrieve.
     * @returns {*} The value associated with the key, or undefined if not set.
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Checks if the context contains a given key.
     * @param {string} key - The key to check.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    has(key) {
        return Object.hasOwnProperty.call(this.data, key);
    }
}

module.exports = Context;
