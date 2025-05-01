// Plugins
import { Quasar, quasarConfig } from "@/plugins/quasar";
// import pinia from "@/plugins/pinia";
////import router from "@/plugins/router";
import i18n from "@/plugins/i18n";
// import VueQueryPlugin, { vueQueryPluginOptions } from "@/plugins/query";
//import highlight from "@/plugins/highlight";

import { createPinia } from "pinia";

// import router from "@/plugins/router";
// import { useQueryClient } from "@tanstack/vue-query";

const pinia = createPinia();

pinia.use(({ store }) => {
    // store.router = markRaw(router);
    // store.queryClient = markRaw(useQueryClient());
});

export default pinia;

export function registerPlugins(app) {
    app.use(Quasar, quasarConfig);
    //app.use(router);
    app.use(pinia);
    app.use(i18n);
    // app.use(VueQueryPlugin, vueQueryPluginOptions);
    //app.use(highlight);
}
