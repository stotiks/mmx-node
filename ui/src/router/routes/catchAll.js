import i18n from "@/plugins/i18n";
export default [
    {
        path: "/:catchAll(.*)*",
        component: () => import("@/pages/ErrorNotFound"),
        meta: {
            requiresAuth: false,
            title: i18n.global.t("route.page_not_found"),
        },
    },
];
