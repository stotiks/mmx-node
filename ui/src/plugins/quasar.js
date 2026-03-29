import { Quasar, Notify, Dialog, Loading, QSpinnerGears } from "quasar";
import iconSet from "quasar/icon-set/svg-mdi-v7";

export const quasarConfig = {
    plugins: { Notify, Dialog, Loading },
    iconSet: iconSet,
    config: {
        dark: true,
        loading: {
            spinner: QSpinnerGears,
            spinnerColor: "primary",
            delay: 400,
        },
    },
};

export { Quasar };
