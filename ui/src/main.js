import App from "./App.vue";
import { registerPlugins } from "./plugins";

import { createQuasarApp } from "@/createQuasarApp";
const app = createQuasarApp(App, registerPlugins);
app.mount("#app");
