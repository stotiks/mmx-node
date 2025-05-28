import i18n from "@/plugins/i18n";
const t = i18n.global.t;

export default [
    {
        path: "/market",
        component: () => import("@/pages/MarketPage"),
        meta: {
            title: t("route.market"),
        },
        children: [
            {
                path: "",
                redirect: "/market/offers",
            },
            {
                path: "offers",
                component: () => import("@/pages/MarketPage/MarketPageOffers"),
                meta: {
                    title: t("route.offers"),
                },
            },
            {
                path: "history",
                component: () => import("@/pages/MarketPage/MarketPageHistory"),
                meta: {
                    title: t("route.history"),
                },
            },
        ],
    },
];
