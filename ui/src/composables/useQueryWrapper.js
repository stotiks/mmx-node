import { useQuery } from "@tanstack/vue-query";

export const useQueryWrapper = (options, ...args) => {
    const query = useQuery(options, ...args);
    const queryKey = options?.queryKey;

    const loading = computed(() => query.isLoading.value || query.isLoadingError.value);
    const rows = computed(() => (!loading.value && query.data.value) || []);

    const isErrorPrev = ref(false);
    const errorPrev = ref(null);
    watch(
        [query.isError, query.data, query.error],
        ([isErrorNew_, dataNew_, errorNew_], [isErrorPrev_, dataPrev_, errorPrev_]) => {
            if (isErrorPrev_) {
                isErrorPrev.value = true;
                errorPrev.value = errorPrev_?.request?.response || errorPrev_?.message;
            }
            if (dataNew_ && !query.isPlaceholderData.value) {
                isErrorPrev.value = false;
                errorPrev.value = null;
            }
        }
    );

    const noData = computed(() => (!query.data.value && !query.isPending.value) || isErrorPrev.value);

    const latestError = computed(() =>
        query.isFetching.value && query.errorUpdateCount.value > 0
            ? errorPrev.value
            : query.error.value?.request?.response || query.error.value?.message
    );
    const isLatestError = computed(() =>
        query.isFetching.value && query.errorUpdateCount.value > 0 ? isErrorPrev.value : query.isError.value
    );

    query.queryKey = queryKey;
    query.loading = loading;
    query.rows = rows;
    query.noData = noData;
    query.latestError = latestError;
    query.isLatestError = isLatestError;
    return query;
};
