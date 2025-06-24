import { defineStore, getActivePinia, acceptHMRUpdate } from "pinia";
import { useLocalStorage, StorageSerializers } from "@vueuse/core";
import { useQueryClient } from "@tanstack/vue-query";

export const useSessionStore = defineStore("session", () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const isLoggedIn = useLocalStorage("isLoggedIn", false);
    const credentials = useLocalStorage("credentials", null, { serializer: StorageSerializers.object });
    const autoLogin = useLocalStorage("autoLogin", false);
    const activeWalletIndex = useLocalStorage("activeWalletIndex", null, { serializer: StorageSerializers.number });

    const market = reactive({
        menu: {
            bid: null,
            ask: null,
        },
    });

    const swap = reactive({
        menu: {
            token: null,
            currency: null,
        },
    });

    const doLogin = (newCredentials) => {
        if (autoLogin.value) {
            credentials.value = newCredentials;
        }

        console.log("login");
        isLoggedIn.value = true;
        if (router.currentRoute.value.query?.redirect) {
            router.replace(router.currentRoute.value.query.redirect);
        } else {
            router.replace("/");
        }
    };

    const doLogout = (userCall) => {
        console.log("logout");
        if (userCall) {
            credentials.value = null;
            autoLogin.value = false;
        }

        isLoggedIn.value = false;

        const appStore = useAppStore();
        if (appStore.isGUI) return;

        if (!userCall && router.currentRoute.value.path != "/login") {
            router.push({
                path: "/login",
                // save the location we were at to come back later
                query: { redirect: router.currentRoute.value.fullPath },
            });
        } else {
            router.push("/login");
        }

        queryClient.clear();
        // reset stores on logout
        getActivePinia()._s.forEach((store) => store.$reset());
    };

    return {
        isLoggedIn,
        credentials,
        autoLogin,
        activeWalletIndex,
        market,
        swap,
        doLogin,
        doLogout,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot));
}
