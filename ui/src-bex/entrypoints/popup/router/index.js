import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes,
});

// TODO
// router.beforeEach((to) => {
//     const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//     if (requiresAuth) {
//         const vaultStore = useVaultStore();
//         if (!vaultStore.isInitialized || !vaultStore.isUnlocked) {
//             return "/";
//         }
//     }
// });

export default router;
