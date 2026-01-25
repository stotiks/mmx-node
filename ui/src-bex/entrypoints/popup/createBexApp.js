import App from "@bex/entrypoints/popup/App.vue";
import { createQuasarApp } from "@/createQuasarApp";
import { registerPlugins } from "@/plugins/registerPlugins";
import router from "@bex/entrypoints/popup/router";
import { createPinia } from "pinia";

/**
 * Creates and mounts a BEX app instance
 * @param {boolean} isNotification - Whether this is a notification window
 */
export const createBexApp = (isNotification = false) => {
    const pinia = createPinia();
    const app = createQuasarApp(App);

    registerPlugins(app, { router, pinia, includeHighlight: false });
    app.provide("isNotification", isNotification);
    app.mount("#app");
};
