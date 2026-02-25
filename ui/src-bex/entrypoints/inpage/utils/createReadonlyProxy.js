/**
 * Creates a readonly proxy for an object.
 * Prevents modification, deletion, and extension of properties.
 *
 * @param {Object} obj - The object to wrap in a readonly proxy
 * @returns {Proxy} A readonly proxy of the object
 */
const createReadonlyProxy = (obj) =>
    new Proxy(obj, {
        // Prevent modification of properties
        set(target, prop, value) {
            console.warn(`MmxProvider: Cannot set property '${String(prop)}' on readonly object`);
            return false;
        },

        // Prevent deletion of properties
        deleteProperty(target, prop) {
            console.warn(`MmxProvider: Cannot delete property '${String(prop)}' from readonly object`);
            return false;
        },

        // Prevent extending the object with new properties
        defineProperty(target, prop, descriptor) {
            console.warn(`MmxProvider: Cannot define property '${String(prop)}' on readonly object`);
            return false;
        },

        // Prevent changing the prototype
        setPrototypeOf(target, proto) {
            console.warn("MmxProvider: Cannot change prototype of readonly object");
            return false;
        },

        // Prevent prototype chain inspection
        getPrototypeOf() {
            return null;
        },

        // Prevent introspection of property descriptors
        getOwnPropertyDescriptor(target, prop) {
            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
            if (descriptor) {
                return {
                    ...descriptor,
                    writable: false,
                    configurable: false,
                };
            }
            return descriptor;
        },

        // Allow reading properties
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            // Return a readonly wrapper for functions
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        },
    });

export { createReadonlyProxy };
