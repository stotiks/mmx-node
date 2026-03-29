export default [
    {
        name: "home",
        path: "/",
        component: () => import("@bex/entrypoints/popup/pages/MainPage"),
        // meta: { requiresAuth: true },
    },

    {
        path: "/password",
        component: () => import("@bex/entrypoints/popup/pages/Settings/PasswordPage"),
        meta: { requiresAuth: true },
    },

    {
        path: "/wallets",
        component: () => import("@bex/entrypoints/popup/pages/Settings/WalletsPage"),
        meta: { requiresAuth: true },
    },

    {
        path: "/history",
        component: () => import("@bex/entrypoints/popup/pages/HistoryPage"),
        meta: { requiresAuth: true },
    },
];
