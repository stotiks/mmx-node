import "quasar/src/css/index.sass";
import "animate.css";
import "unfonts.css";
import "@/css/app.scss";

import { createApp } from "vue";

import App from "./App.vue";
import { registerPlugins } from "./plugins";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
