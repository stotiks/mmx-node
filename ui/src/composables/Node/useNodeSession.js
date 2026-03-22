import { useQueryClient } from "@tanstack/vue-query";
import { useSession, useLogin } from "@/queries/server";
import { prefetchConfig } from "@/queries/wapi";

const useHandleLogin = () => {
    const sessionStore = useSessionStore();
    const login = useLogin();
    const queryClient = useQueryClient();
    const handleLogin = (credentials) => {
        login.mutate(
            { credentials },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["config"] });
                },
                onError: () => sessionStore.doLogout(false),
            }
        );
    };
    return handleLogin;
};

export const useNodeSession = () => {
    const sessionStore = useSessionStore();
    const handleLogin = useHandleLogin();

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

    // if (import.meta.env.PROD) {
    //     watch(isError, (isError) => {
    //         if (isError) {
    //             sessionStore.doLogout(false);
    //         }
    //     });
    // }
};
