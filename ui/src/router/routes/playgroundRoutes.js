import catchAll from "./subroutes/catchAll";
import txQrSendRoute from "./subroutes/txQrSendRoute";

export default [
    {
        path: "/",
        redirect: "/pg/bex",
    },
    {
        path: "/pg/",
        component: () => import("@/pages/!pg/index.vue"),
        meta: {
            title: "PLAYGROUND",
        },
        children: [
            {
                path: "",
                redirect: "/pg/bex",
            },
            {
                path: "/pg/bex",
                component: () => import("@/pages/!pg/bex.vue"),
                meta: {
                    title: "BEX PLAYGROUND",
                },
            },
            {
                path: "/pg/tx",
                component: () => import("@/pages/!pg/tx.vue"),
                meta: {
                    title: "TX PLAYGROUND",
                },
            },
            {
                path: "/pg/whale",
                component: () => import("@/pages/!pg/whale"),
                meta: {
                    title: "Whale",
                },
            },
        ],
    },
    txQrSendRoute,
    ...catchAll,
];
