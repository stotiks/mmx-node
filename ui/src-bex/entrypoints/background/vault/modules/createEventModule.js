/**
 * Event Module - Manages event registration, removal, and emission using closures
 *
 * This module provides a complete event system with:
 * - Event registration with callback management
 * - Event removal with proper cleanup
 * - Event emission with error handling
 * - Wildcard event support for monitoring all events
 *
 * Uses closures to maintain private event storage.
 */

/**
 * Creates an event manager with closure-based private event storage
 * @returns {Object} Event system interface
 */
export const createEventModule = () => {
    // Private event storage - Map of event names to callback arrays
    const events = new Map();

    // Create the module object with proper method references
    const module = {
        /**
         * Register an event listener
         * @param {string} eventName - Name of the event to listen for
         * @param {Function} callback - Function to call when event is emitted
         * @returns {Object} Event module instance for chaining
         */
        on: function (eventName, callback) {
            if (typeof eventName !== "string") {
                throw new Error("Event name must be a string");
            }
            if (typeof callback !== "function") {
                throw new Error("Callback must be a function");
            }

            // Initialize event array if it doesn't exist
            if (!events.has(eventName)) {
                events.set(eventName, []);
            }

            // Add callback to event array
            events.get(eventName).push(callback);

            // Return this for chaining
            return this;
        },

        /**
         * Remove an event listener
         * @param {string} eventName - Name of the event
         * @param {Function} callback - Specific callback to remove
         * @returns {Object} Event module instance for chaining
         */
        removeListener: function (eventName, callback) {
            if (typeof eventName !== "string") {
                throw new Error("Event name must be a string");
            }
            if (typeof callback !== "function") {
                throw new Error("Callback must be a function");
            }

            if (events.has(eventName)) {
                const callbacks = events.get(eventName);
                const index = callbacks.indexOf(callback);

                if (index > -1) {
                    callbacks.splice(index, 1);

                    // Clean up empty event arrays
                    if (callbacks.length === 0) {
                        events.delete(eventName);
                    }
                }
            }

            // Return this for chaining
            return this;
        },

        /**
         * Emit an event to all registered listeners
         * @param {string} eventName - Name of the event to emit
         * @param {...*} args - Arguments to pass to event listeners
         */
        emit: function (eventName, ...args) {
            if (typeof eventName !== "string") {
                throw new Error("Event name must be a string");
            }

            // Emit to specific event listeners
            if (events.has(eventName)) {
                const callbacks = events.get(eventName);

                // Create a copy of callbacks array to prevent issues if listeners are modified during emission
                const callbacksCopy = [...callbacks];

                callbacksCopy.forEach((callback) => {
                    try {
                        callback(...args);
                    } catch (err) {
                        console.error(`Error in ${eventName} event handler:`, err);
                        // Continue with other callbacks even if one fails
                    }
                });
            }

            // Emit to wildcard listeners (for monitoring all events)
            if (events.has("<any>")) {
                const wildcardCallbacks = events.get("<any>");
                const wildcardCallbacksCopy = [...wildcardCallbacks];

                wildcardCallbacksCopy.forEach((callback) => {
                    try {
                        callback(eventName, ...args);
                    } catch (err) {
                        console.error(`Error in wildcard event handler for ${eventName}:`, err);
                        // Continue with other callbacks even if one fails
                    }
                });
            }
        },

        /**
         * Get the number of listeners for a specific event (for testing/debugging)
         * @param {string} eventName - Name of the event
         * @returns {number} Number of listeners
         */
        getListenerCount: (eventName) => {
            if (typeof eventName !== "string") {
                throw new Error("Event name must be a string");
            }
            return events.has(eventName) ? events.get(eventName).length : 0;
        },

        /**
         * Get all registered event names (for testing/debugging)
         * @returns {string[]} Array of event names
         */
        getEventNames: () => {
            return Array.from(events.keys());
        },

        /**
         * Remove all listeners for a specific event
         * @param {string} eventName - Name of the event to clear
         */
        removeAllListeners: (eventName) => {
            if (typeof eventName !== "string") {
                throw new Error("Event name must be a string");
            }
            events.delete(eventName);
        },

        /**
         * Remove all listeners for all events (cleanup)
         */
        removeAllListenersForAllEvents: () => {
            events.clear();
        },
    };

    return module;
};
