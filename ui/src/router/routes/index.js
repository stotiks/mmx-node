import node from "./node";
import wallet from "./wallet";
import farmer from "./farmer";
import explore from "./explore";
import market from "./market";
import swap from "./swap";
import catchAll from "./catchAll";

const guiRoutes = [
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
            title: "Login",
            layout: false,
            requiresAuth: false,
        },
    },
    {
        path: "/settings",
        component: () => import("@/pages/SettingsPage"),
        meta: {
            title: "Settings",
        },
    },
    // {
    //     path: "/tx/test",
    //     component: () => import("@/pages/!tests/tx.vue"),
    //     meta: {
    //         title: "TX Test",
    //     },
    // },
];

const txQrSendRoute = {
    name: "tx-qr-send",
    path: "/tx/qr/send/:txData",
    component: () => import("@/pages/Offline/TXQrSend.vue"),
    props: (route) => ({ txData: route.params.txData }),
    meta: {
        title: "QR TX Send",
    },
};

const offlineRoutes = [
    {
        path: "/",
        redirect: "/tx/qr",
    },
    {
        path: "/tx/qr",
        component: () => import("@/pages/Offline/TxQrGen.vue"),
        meta: {
            title: "Offline wallet",
        },
    },
    // eslint-disable-next-line no-undef
    ...(process.env.NODE_ENV === "production" ? [] : [txQrSendRoute]),
    ...catchAll,
];

const explorerRoutes = [
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
            title: "Web Wallet",
        },
    },
    {
        path: "/pg/tx",
        component: () => import("@/pages/!pg/tx.vue"),
        meta: {
            title: "TX Test",
        },
    },
    txQrSendRoute,
    ...catchAll,
];

const playgroundRoutes = [
    {
        path: "/",
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
    txQrSendRoute,
    ...catchAll,
];

let routes;
// eslint-disable-next-line no-undef
if (__BUILD_TARGET__ === "GUI") {
    routes = guiRoutes;
    // eslint-disable-next-line no-undef
} else if (__BUILD_TARGET__ === "EXPLORER") {
    routes = explorerRoutes;
    // eslint-disable-next-line no-undef
} else if (__BUILD_TARGET__ === "OFFLINE") {
    routes = offlineRoutes;
    // eslint-disable-next-line no-undef
} else if (__BUILD_TARGET__ === "PLAYGROUND") {
    routes = playgroundRoutes;
} else {
    throw new Error("routes: Unknown build target");
}

export default routes;
