import "quasar/src/css/index.sass";
import "animate.css";
import "unfonts.css";
import "@/css/app.scss";

import { createApp } from "vue";
export const createQuasarApp = (App, registerPlugins) => {
    const app = createApp(App);
    registerPlugins(app);
    return app;
};
