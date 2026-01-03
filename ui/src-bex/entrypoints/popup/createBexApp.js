import App from "@bex/entrypoints/popup/App.vue";
import { registerPlugins } from "@bex/entrypoints/popup/plugins";

import { createQuasarApp } from "@/createQuasarApp";

export const createBexApp = (isNotification = false) => {
    const app = createQuasarApp(App, registerPlugins);
    app.provide("isNotification", isNotification);
    app.mount("#app");
};
