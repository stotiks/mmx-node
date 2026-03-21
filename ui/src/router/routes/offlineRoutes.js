import i18n from "@/plugins/i18n";
const t = i18n.global.t;

import catchAll from "./subroutes/catchAll";
import txQrSendRoute from "./subroutes/txQrSendRoute";

export default [
    {
        path: "/",
        redirect: "/tx/qr",
    },
    {
        path: "/tx/qr",
        component: () => import("@/pages/Offline/TxQrGen.vue"),
        meta: {
            title: () => t("route.offline_wallet"),
        },
    },
    txQrSendRoute,
    ...catchAll,
];
