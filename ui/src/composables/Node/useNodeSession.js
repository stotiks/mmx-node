import { useQueryClient } from "@tanstack/vue-query";
import { useSession, useLogin } from "@/queries/server";
import { prefetchConfig } from "@/queries/wapi";

export const useNodeSession = () => {
    const sessionStore = useSessionStore();

    const login = useLogin();
    const queryClient = useQueryClient();
    const handleLogin = (credentials) => {
        login.mutate(
            { credentials },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["config"] });
                    prefetchConfig(queryClient);
                },
                onError: () => sessionStore.doLogout(false),
            }
        );
    };

    const { data } = useSession();
    watch(data, (data) => {
        if (!data?.user) {
            if (sessionStore.autoLogin) {
                handleLogin(sessionStore.credentials);
            } else {
                sessionStore.doLogout(false);
            }
        }
    });

    // if (process.env.NODE_ENV === "production") {
    //     watch(isError, (isError) => {
    //         if (isError) {
    //             sessionStore.doLogout(false);
    //         }
    //     });
    // }
};
