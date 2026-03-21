import i18n from "@/plugins/i18n";
const t = i18n.global.t;

import node from "./subroutes/node";
import wallet from "./subroutes/wallet";
import farmer from "./subroutes/farmer";
import explore from "./subroutes/explore";
import market from "./subroutes/market";
import swap from "./subroutes/swap";
import catchAll from "./subroutes/catchAll";

export default [
    ...node,
    ...wallet,
    ...farmer,
    ...explore,
    ...market,
    ...swap,
    ...catchAll,
    {
        path: "/",
        redirect: "/node",
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/pages/LoginPage"),
        meta: {
            title: () => t("route.login"),
            layout: false,
            requiresAuth: false,
        },
    },
    {
        path: "/settings",
        component: () => import("@/pages/SettingsPage"),
        meta: {
            title: () => t("route.settings"),
        },
    },
];
