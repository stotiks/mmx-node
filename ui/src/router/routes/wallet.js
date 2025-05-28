export default [
    {
        path: "/wallet",
        component: () => import("@/pages/WalletPage"),
        children: [
            {
                path: "",
                component: () => import("@/pages/Wallet/AccountIndex"),
                meta: {
                    title: t("route.wallets"),
                },
            },
            {
                path: "create",
                component: () => import("@/pages/Wallet/WalletCreate"),
                meta: {
                    title: t("route.create_wallet"),
                },
            },
            {
                path: "account/:index",
                component: () => import("@/pages/Wallet/AccountView"),
                props: (route) => ({ index: parseInt(route.params.index) }),
                meta: {
                    title: (route) => `Wallet #${route.params.index}`,
                },
                children: [
                    {
                        path: "",
                        component: () => import("@/pages/Wallet/Account/AccountHome"),
                        meta: {
                            title: t("route.balance"),
                        },
                    },
                    {
                        path: "nfts",
                        component: () => import("@/pages/Wallet/Account/AccountNFT"),
                        meta: {
                            title: t("route.nfts"),
                        },
                    },
                    {
                        path: "contracts",
                        component: () => import("@/pages/Wallet/Account/AccountContracts"),
                        meta: {
                            title: t("route.contracts"),
                        },
                    },
                    {
                        path: "send/:target?",
                        component: () => import("@/pages/Wallet/Account/AccountSend"),
                        props: (route) => ({ target: route.params.target }),
                        meta: {
                            title: t("route.send"),
                        },
                    },
                    {
                        path: "send_from/:source?",
                        component: () => import("@/pages/Wallet/Account/AccountSend"),
                        props: (route) => ({ source: route.params.source }),
                        meta: {
                            title: t("route.send"),
                        },
                    },
                    {
                        path: "history",
                        component: () => import("@/pages/Wallet/Account/AccountHistory"),
                        meta: {
                            title: t("route.history"),
                        },
                    },
                    {
                        path: "log",
                        component: () => import("@/pages/Wallet/Account/AccountLog"),
                        meta: {
                            title: t("route.log"),
                        },
                    },
                    {
                        path: "offer",
                        component: () => import("@/pages/Wallet/Account/AccountOffer"),
                        meta: {
                            title: t("route.offer"),
                        },
                    },
                    {
                        path: "liquid",
                        component: () => import("@/pages/Wallet/Account/AccountLiquid"),
                        meta: {
                            title: t("route.liquidity"),
                        },
                    },
                    {
                        path: "plotnfts",
                        component: () => import("@/pages/Wallet/Account/AccountPlotNFTs"),
                        meta: {
                            title: t("route.plot_nfts"),
                        },
                    },
                    {
                        path: "details",
                        component: () => import("@/pages/Wallet/Account/AccountDetails"),
                        meta: {
                            title: t("route.info"),
                        },
                    },
                    {
                        path: "options",
                        component: () => import("@/pages/Wallet/Account/AccountOptions"),
                        meta: {
                            title: t("route.options"),
                        },
                    },
                ],
            },
        ],
    },
];
