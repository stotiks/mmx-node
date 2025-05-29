export default [
    {
        name: "home",
        path: "/",
        component: () => import("@bex/entrypoints/popup/pages/MainPage"),
    },

    {
        path: "/password",
        component: () => import("@bex/entrypoints/popup/pages/PasswordPage"),
    },

    {
        path: "/wallets",
        component: () => import("@bex/entrypoints/popup/pages/WalletsPage"),
    },
];
