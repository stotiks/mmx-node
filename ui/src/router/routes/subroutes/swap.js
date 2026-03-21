import i18n from "@/plugins/i18n";
const t = i18n.global.t;

export default [
    {
        path: "/swap",
        component: () => import("@/pages/SwapPage"),
        meta: {
            title: () => t("route.swap"),
        },
        children: [
            {
                path: "",
                component: () => import("@/pages/Swap/SwapList"),
            },
            {
                path: ":address",
                component: () => import("@/pages/Swap/SwapView"),
                props: (route) => ({
                    address: route.params.address,
                }),
                children: [
                    {
                        path: "",
                        redirect: { name: "trade" },
                    },
                    {
                        name: "trade",
                        path: "trade",
                        component: () => import("@/pages/Swap/SwapTrade"),
                        meta: {
                            title: () => t("route.trade"),
                        },
                    },
                    {
                        path: "history",
                        component: () => import("@/pages/Swap/SwapHistory"),
                        meta: {
                            title: () => t("route.history"),
                        },
                    },
                    {
                        path: "liquid",
                        component: () => import("@/pages/Swap/SwapLiquid"),
                        meta: {
                            title: () => t("route.liquid"),
                        },
                    },
                    {
                        path: "pool",
                        component: () => import("@/pages/Swap/SwapPool"),
                        meta: {
                            title: () => t("route.pool"),
                        },
                    },
                ],
            },
        ],
    },
];
