// Plugins
import { Quasar, quasarConfig } from "@/plugins/quasar";
import router from "@/plugins/router";
import i18n from "@/plugins/i18n";
import pinia from "@/plugins/pinia";
import VueQueryPlugin, { vueQueryPluginOptions } from "@/plugins/query";
import highlight from "@/plugins/highlight";

export function registerPlugins(app) {
    app.use(Quasar, quasarConfig);
    app.use(router);    
    app.use(i18n);
    app.use(pinia);
    app.use(VueQueryPlugin, vueQueryPluginOptions);
    app.use(highlight);
}
