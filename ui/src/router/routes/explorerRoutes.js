import i18n from "@/plugins/i18n";
const t = i18n.global.t;

import explore from "./subroutes/explore";
import catchAll from "./subroutes/catchAll";
import playgroundRoutes from "./playgroundRoutes";
import txQrSendRoute from "./subroutes/txQrSendRoute";

export default [
    ...explore,
    ...catchAll,
    {
        path: "/",
        redirect: "/explore",
    },
    {
        path: "/wallet",
        component: () => import("@/pages/WebWalletPage"),
        meta: {
            title: () => t("route.web_wallet"),
        },
    },
    ...playgroundRoutes,
    txQrSendRoute,
];
