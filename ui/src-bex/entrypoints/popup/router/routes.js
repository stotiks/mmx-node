export default [
    {
        name: "home",
        path: "/",
        component: () => import("@bex/entrypoints/popup/pages/MainPage"),
    },

    {
        path: "/password",
        component: () => import("@bex/entrypoints/popup/pages/Settings/PasswordPage"),
    },

    {
        path: "/wallets",
        component: () => import("@bex/entrypoints/popup/pages/Settings/WalletsPage"),
    },

    {
        path: "/history",
        component: () => import("@bex/entrypoints/popup/pages/HistoryPage"),
    },
];
