import i18n from "@/plugins/i18n";
const t = i18n.global.t;

export default [
    {
        path: "/:catchAll(.*)*",
        component: () => import("@/pages/ErrorNotFound"),
        meta: {
            requiresAuth: false,
            title: () => t("route.page_not_found"),
        },
    },
];
