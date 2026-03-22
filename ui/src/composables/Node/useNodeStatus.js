import { useConfigData } from "@/composables/Node/useConfigData";
import { useIsQueryTakingLong } from "@/composables/useIsQueryTakingLong";
import { usePeers } from "@/queries/api";
import { useSession } from "@/queries/server";
import { useNodeInfo } from "@/queries/wapi";
import { useSessionStore } from "@/stores/session";
import { useIntervalFn } from "@vueuse/core";

export const NodeStatuses = Object.freeze({
    DisconnectedFromNode: Symbol("DisconnectedFromNode"),
    QueryTakingLong: Symbol("QueryTakingLong"),
    //LoggedOff: Symbol("LoggedOff"),
    ConnectingToNetwork: Symbol("ConnectingToNetwork"),
    Syncing: Symbol("Syncing"),
    Synced: Symbol("Synced"),
    None: Symbol("None"),
});

const usePollingQuery = (query, intervalGetter) => {
    const { refetch, isFetching, queryKey } = query;

    const intervalFn = async () => {
        if (isFetching.value) return;

        //console.log("usePollingQuery refetch", queryKey, toValue(intervalGetter));
        await refetch();
    };

    useIntervalFn2(intervalFn, intervalGetter);
    return query;
};

const useSessionPolling = () => {
    const sessionStore = useSessionStore();

    const sessionQuery = useSession({ refetchInterval: false });

    const isConnected = computed(() => !sessionQuery.isError.value);
    const isValidSession = computed(() => isConnected.value && !!sessionQuery.data.value?.user);

    const connectedToNode = computed(() => isValidSession.value);
    const sessionInterval = computed(() => (sessionStore.isLoggedIn ? (connectedToNode.value ? 5000 : 1000) : -1));

    usePollingQuery(sessionQuery, sessionInterval);

    return { connectedToNode };
};

const usePeersPolling = (connectedToNode) => {
    const { isLocalNode } = useConfigData();

    const peerQuery = usePeers({ refetchInterval: false });

    const isPeersConnected = computed(() => !peerQuery.isError.value && (peerQuery.data.value?.length ?? 0) > 0);

    // watchEffect(() => {
    //     console.debug("isPeersConnected", isPeersConnected.value);
    // });

    const connectedToNetwork = computed(
        () =>
            connectedToNode.value &&
            ((isPeersConnected.value && isLocalNode.value) || (!isLocalNode.value && isLocalNode.value != null))
    );
    const peerInfoInterval = computed(() => (connectedToNode.value ? (connectedToNetwork.value ? 5000 : 1000) : -1));

    usePollingQuery(peerQuery, peerInfoInterval);

    return { connectedToNetwork };
};

const useNodeInfoPolling = (connectedToNetwork) => {
    const nodeInfoQuery = useNodeInfo({ refetchInterval: false });

    const isSynced = computed(() => !nodeInfoQuery.isError.value && !!nodeInfoQuery.data.value?.is_synced);
    const synced = computed(() => connectedToNetwork.value && isSynced.value);

    const nodeInfoInterval = computed(() => (connectedToNetwork.value ? (isSynced.value ? 5000 : 1000) : -1));

    // watchEffect(() => {
    //     console.debug("nodeInfoInterval", nodeInfoInterval.value);
    // });

    usePollingQuery(nodeInfoQuery, nodeInfoInterval);

    return { synced };
};

export const useNodeStatus = () => {
    // const isQueryTakingLong = useIsQueryTakingLong(1000);

    const { connectedToNode } = useSessionPolling();
    const { connectedToNetwork } = usePeersPolling(connectedToNode);
    const { synced } = useNodeInfoPolling(connectedToNetwork);

    const status = computed(() => {
        if (!connectedToNode.value) return NodeStatuses.DisconnectedFromNode;
        if (!connectedToNetwork.value) return NodeStatuses.ConnectingToNetwork;
        if (!synced.value) return NodeStatuses.Syncing;
        return NodeStatuses.Synced;
    });

    if (import.meta.env.DEV) {
        // --- Debug
        watchEffect(() => {
            // console.debug("isQueryTakingLong", isQueryTakingLong.value);
            console.debug("connectedToNode", connectedToNode.value);
            console.debug("connectedToNetwork", connectedToNetwork.value);
            console.debug("synced", synced.value);

            console.debug("status", status.value);
        });
    }

    return {
        status,
    };
};

const useIntervalFn2 = (cb, interval) => {
    // Validate callback parameter
    if (typeof cb !== "function") {
        throw new TypeError("useIntervalFn2: callback must be a function");
    }

    const intervalFn = useIntervalFn(cb, interval);

    // Watch for interval changes to handle pause/resume and immediate execution
    watch(interval, (newInterval, oldInterval) => {
        const shouldPause = newInterval <= 0;
        const wasPaused = oldInterval <= 0;
        const isNowActive = newInterval > 0;

        if (shouldPause) {
            if (intervalFn.isActive.value) {
                cb();
            }
            intervalFn.pause();
            return;
        }

        // Resume if currently paused
        if (!intervalFn.isActive.value) {
            intervalFn.resume();
        }

        // Determine if callback should execute immediately
        const shouldExecuteImmediately =
            (wasPaused && isNowActive) || // Transitioning from paused to active
            (oldInterval > 0 && newInterval < oldInterval); // Interval decreased (faster polling)

        if (shouldExecuteImmediately) {
            cb();
        }
    });

    // Execute callback immediately on initialization if interval is active
    if (toValue(interval) > 0) {
        cb();
    }

    return intervalFn;
};
