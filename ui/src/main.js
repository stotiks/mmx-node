import App from "./App.vue";
import { createQuasarApp } from "@/createQuasarApp";
import { registerPlugins } from "@/plugins/registerPlugins";
import router from "@/router";
import pinia from "@/plugins/pinia";

const app = createQuasarApp(App);
registerPlugins(app, { router, pinia });
app.mount("#app");
