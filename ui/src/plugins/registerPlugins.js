import { Quasar, quasarConfig } from "@/plugins/quasar";
import i18n from "@/plugins/i18n";
import VueQueryPlugin, { vueQueryPluginOptions } from "@/plugins/query";
import highlight from "@/plugins/highlight";

/**
 * Registers all application plugins with the Vue app instance
 * @param {App} app - Vue app instance
 * @param {Object} options - Plugin registration options
 * @param {Router} options.router - Vue Router instance (required)
 * @param {Pinia} options.pinia - Pinia store instance (required)
 * @param {boolean} [options.includeHighlight=true] - Whether to include syntax highlighting
 */
export const registerPlugins = (app, options = {}) => {
    const { router, pinia, includeHighlight = true } = options;

    if (!router) {
        throw new Error("Router is required for plugin registration");
    }
    if (!pinia) {
        throw new Error("Pinia is required for plugin registration");
    }

    // Quasar (always required)
    app.use(Quasar, quasarConfig);

    // Router (context-specific)
    app.use(router);

    // Pinia (context-specific)
    app.use(pinia);

    // i18n (shared)
    app.use(i18n);

    // TanStack Query (shared)
    app.use(VueQueryPlugin, vueQueryPluginOptions);

    // Highlight (optional - excluded for BEX to reduce bundle size)
    if (includeHighlight) {
        app.use(highlight);
    }
};
