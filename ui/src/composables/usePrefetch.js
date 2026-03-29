import { useQueryClient } from "@tanstack/vue-query";

export const usePrefetch = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const pathPrefetcher = (path) => {
        if (path) {
            const route = router.resolve(path);
            if (route.meta?.prefetcher) {
                route.meta.prefetcher(queryClient, route);
            }
        }
        return path;
    };

    return { pathPrefetcher };
};
