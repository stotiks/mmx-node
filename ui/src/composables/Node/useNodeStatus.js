import { useQueryClient } from "@tanstack/vue-query";
import { fetchSession } from "@/queries/server";
import { fetchPeerInfo } from "@/queries/api";
import { fetchNodeInfo } from "@/queries/wapi";
import { useSessionStore } from "@/stores/session";
import { useConfigData } from "@/composables/Node/useConfigData";
import { useIsQueryTakingLong } from "@/composables/useIsQueryTakingLong";
import { useIntervalFn2 } from "@/composables/useIntervalFn2";

export const NodeStatuses = Object.freeze({
    DisconnectedFromNode: Symbol("DisconnectedFromNode"),
    QueryTakingLong: Symbol("QueryTakingLong"),
    //LoggedOff: Symbol("LoggedOff"),
    Connecting: Symbol("Connecting"),
    Syncing: Symbol("Syncing"),
    Synced: Symbol("Synced"),
    None: Symbol("None"),
});

export const useNodeStatus = () => {
    const sessionStore = useSessionStore();
    const { isLocalNode } = useConfigData();
    const queryClient = useQueryClient();

    const sessionFails = ref(0);
    const peerFails = ref(0);
    const syncFails = ref(1);

    const isQueryTakingLong = useIsQueryTakingLong(1000);

    const connectedToNode = computed(() => sessionFails.value < 1);
    const connectedToNetwork = computed(() => (connectedToNode.value && peerFails.value < 1) || !isLocalNode.value);
    const synced = computed(() => connectedToNetwork.value && syncFails.value < 1);

    // --- Session Query using fetchQuery
    const sessionIntervalFn = async () => {
        if (sessionStore.isLoggedIn) {
            try {
                const data = await fetchSession(queryClient);

                if (data?.user) {
                    sessionFails.value = 0;
                } else {
                    throw new Error("No valid session");
                }
            } catch (error) {
                sessionFails.value++;
            }
        }
    };

    const sessionInterval = computed(() => {
        if (!sessionStore.isLoggedIn) return -1;
        return connectedToNode.value ? 5000 : 1000;
    });

    useIntervalFn2(sessionIntervalFn, sessionInterval);

    // --- Peer Info Query using fetchQuery
    const peerInfoIntervalFn = async () => {
        try {
            const data = await fetchPeerInfo(queryClient);

            if (data?.peers?.length > 0) {
                peerFails.value = 0;
            } else {
                throw new Error("No peers");
            }
        } catch (error) {
            peerFails.value++;
        }
    };

    const peerInfoInterval = computed(() => {
        if (!connectedToNode.value) return -1;
        return connectedToNetwork.value ? 5000 : 1000;
    });

    useIntervalFn2(peerInfoIntervalFn, peerInfoInterval);

    // --- Node Info Query using fetchQuery
    const nodeInfoIntervalFn = async () => {
        try {
            const data = await fetchNodeInfo(queryClient);

            if (data?.is_synced) {
                syncFails.value = 0;
            } else {
                throw new Error("No Sync");
            }
        } catch (error) {
            syncFails.value++;
        }
    };

    const nodeInfoInterval = computed(() => {
        if (!connectedToNode.value) return -1;
        return connectedToNetwork.value ? 5000 : 1000;
    });

    useIntervalFn2(nodeInfoIntervalFn, nodeInfoInterval);

    // --- Current Status
    const currentStatus = computed(() => {
        let status = NodeStatuses.None;

        if (connectedToNode.value) {
            status = NodeStatuses.Connecting;
            if (connectedToNetwork.value) {
                status = NodeStatuses.Syncing;
                if (synced.value) {
                    status = NodeStatuses.Synced;
                }
            }
        } else {
            status = NodeStatuses.DisconnectedFromNode;
        }

        return status;
    });

    if (process.env.NODE_ENV !== "production") {
        // --- Debug
        watchEffect(() => {
            console.debug("isQueryTakingLong", isQueryTakingLong.value);
            //console.debug("sessionFails", sessionFails.value);
            console.debug("connectedToNode", connectedToNode.value);
            //console.debug("peerFails", peerFails.value);
            console.debug("connectedToNetwork", connectedToNetwork.value);
            //console.debug("syncFails", syncFails.value);
            console.debug("synced", synced.value);
            console.debug("currentStatus", currentStatus.value);
        });
    }

    return {
        status: currentStatus,
    };
};
