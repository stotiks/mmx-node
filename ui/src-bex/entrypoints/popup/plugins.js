// Plugins
import { Quasar, quasarConfig } from "@/plugins/quasar";

export function registerPlugins(app) {
    app.use(Quasar, quasarConfig);
}
