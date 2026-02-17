export const createPermissionModule = (dependencies = {}) => {
    const { eventModule, requireUnlocked } = dependencies;

    if (!eventModule || typeof eventModule.emit !== "function") {
        throw new Error("Event module is required");
    }

    // Private permission storage - Set of allowed origins
    const allowedOriginsSet = new Set();

    /**
     * Validate URL and extract origin with security checks
     * @param {string} url - URL to validate
     * @returns {URL} Validated URL object
     */
    const checkUrl = (url) => {
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch (error) {
            throw new Error(`Invalid URL format: ${error.message}`);
        }

        // Security check: don't allow file:// or other potentially unsafe protocols
        if (!["http:", "https:"].includes(urlObj.protocol)) {
            throw new Error(`Unsafe protocol not allowed: ${urlObj.protocol}`);
        }

        return urlObj;
    };

    const module = {
        /**
         * Check if a URL has permission
         * @param {string} url - URL to check
         * @returns {Promise<boolean>} Permission status
         */
        checkUrlPermissionsAsync: async (url) => {
            requireUnlocked();

            try {
                const origin = checkUrl(url).origin;
                return allowedOriginsSet.has(origin);
            } catch (error) {
                console.error("Permission: Invalid URL provided to checkUrlPermissionsAsync:", error);
                return false;
            }
        },
        /**
         * Grant permission to a URL
         * @param {string} url - URL to allow
         * @returns {Promise<void>}
         */
        allowUrlAsync: async (url) => {
            requireUnlocked();

            try {
                const origin = checkUrl(url).origin;
                allowedOriginsSet.add(origin);
                eventModule.emit("permission-granted", { origin });
            } catch (error) {
                console.error("Permission: Failed to allow URL:", error);
                throw new Error(`Invalid URL: ${error.message}`);
            }
        },

        /**
         * Revoke permission from a URL
         * @param {string} url - URL to revoke
         * @returns {Promise<void>}
         */
        revokeUrlAsync: async (url) => {
            requireUnlocked();

            try {
                const origin = checkUrl(url).origin;
                allowedOriginsSet.delete(origin);
                eventModule.emit("permission-revoked", { origin });
            } catch (error) {
                console.error("Permission: Failed to revoke URL:", error);
                throw new Error(`Invalid URL: ${error.message}`);
            }
        },

        /**
         * Get all allowed origins
         * @returns {string[]} Array of allowed origins
         */
        getAllowedOrigins: () => {
            requireUnlocked();
            return Array.from(allowedOriginsSet);
        },

        /**
         * Clear all permissions (for cleanup)
         */
        clearAllPermissions: () => {
            allowedOriginsSet.clear();
            eventModule.emit("all-permissions-cleared");
        },

        /**
         * Get permission count (for debugging/testing)
         * @returns {number} Number of allowed origins
         */
        getPermissionCount: () => {
            return allowedOriginsSet.size;
        },

        /**
         * Check if a specific origin is allowed (direct origin check)
         * @param {string} origin - Origin to check
         * @returns {boolean} Permission status
         */
        hasOriginPermission: (origin) => {
            if (typeof origin !== "string" || !origin) {
                return false;
            }
            return allowedOriginsSet.has(origin);
        },

        /**
         * Add origin directly (for internal use)
         * @param {string} origin - Origin to add
         */
        addOrigin: (origin) => {
            if (typeof origin !== "string" || !origin) {
                throw new Error("Origin must be a non-empty string");
            }
            allowedOriginsSet.add(origin);
        },

        /**
         * Remove origin directly (for internal use)
         * @param {string} origin - Origin to remove
         */
        removeOrigin: (origin) => {
            if (typeof origin !== "string" || !origin) {
                throw new Error("Origin must be a non-empty string");
            }
            allowedOriginsSet.delete(origin);
        },
    };

    return module;
};
