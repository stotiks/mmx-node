// Plugins
import { Quasar, quasarConfig } from "@/plugins/quasar";
import router from "./router";
import i18n from "@/plugins/i18n";
import VueQueryPlugin, { vueQueryPluginOptions } from "@/plugins/query";
//import highlight from "@/plugins/highlight";

import { createPinia } from "pinia";
const pinia = createPinia();

export function registerPlugins(app) {
    app.use(Quasar, quasarConfig);
    app.use(router);
    app.use(pinia);
    app.use(i18n);
    app.use(VueQueryPlugin, vueQueryPluginOptions);
    //app.use(highlight);
}
