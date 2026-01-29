import axios from "@/queries/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { jsonContentTypeHeaders, noCacheHeaders, ONE_SECOND } from "../common";

const login = (credentials) => axios.post("/server/login", credentials, { headers: jsonContentTypeHeaders });
export const useLogin = () => {
    return useMutation({
        mutationFn: ({ credentials }) => login(credentials),
    });
};

const logout = () => axios.get("/server/logout").then((response) => response.data);
export const useLogout = () => {
    const sessionStore = useSessionStore();
    return useMutation({
        mutationFn: () => logout(),
        onSettled: () => {
            sessionStore.doLogout(true);
        },
    });
};

const session = (signal) =>
    axios.get("/server/session", { signal, headers: noCacheHeaders }).then((response) => response.data);
export const useSession = () => {
    const sessionStore = useSessionStore();
    return useQuery({
        queryKey: ["session"],
        queryFn: ({ signal }) => session(signal),
        refetchInterval: 5.1 * ONE_SECOND,
        //refetchIntervalInBackground: true,
        enabled: sessionStore.isLoggedIn,
    });
};

export const fetchSession = async (queryClient) => {
    return await queryClient.fetchQuery({
        queryKey: ["session"],
        queryFn: ({ signal }) => session(signal),
        staleTime: 0,
    });
};
