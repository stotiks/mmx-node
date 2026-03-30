import { useConfig, useSetConfig } from "@/queries/wapi";

const configMapping = {
    timelord: {
        name: "timelord",
        restart: true,
        default: false,
    },
    open_port: {
        name: "Router.open_port",
        restart: true,
        default: false,
    },
    allow_remote: {
        name: "allow_remote",
        restart: true,
        default: false,
    },

    cuda_enable: {
        name: "cuda.enable",
        restart: true,
        default: false,
    },

    opencl_platform: {
        name: "opencl.platform",
        restart: true,
        default: null,
        suppressNotification: true,
    },
    opencl_device: {
        name: "Node.opencl_device",
        restart: true,
        suppressNotification: true,
    },
    opencl_device_name: {
        name: "Node.opencl_device_name",
        restart: true,
    },
    opencl_device_select: {
        name: "Node.opencl_device_select",
        restart: true,
        default: -1,
        tmp_only: true,
        suppressNotification: true,
    },
    opencl_device_list: {
        // locally calculated field — never sent to setConfig
        default: [],
    },
    opencl_device_list_relidx: {
        // locally calculated field — never sent to setConfig
        default: [],
    },

    farmer_reward_addr: {
        name: "Farmer.reward_addr",
        restart: true,
    },
    timelord_reward_addr: {
        name: "TimeLord.reward_addr",
        restart: true,
    },

    harv_num_threads: {
        name: "Harvester.num_threads",
        restart: true,
    },
    reload_interval: {
        name: "Harvester.reload_interval",
        restart: true,
    },
    recursive_search: {
        name: "Harvester.recursive_search",
        restart: true,
        default: false,
    },

    plot_dirs: {
        name: "Harvester.plot_dirs",
        restart: false,
    },

    version: {
        name: "build.version",
    },
    commit: {
        name: "build.commit",
    },
};

// Keys that have a server-side `name` and should be sent via setConfig on user edits.
const writableKeys = Object.keys(configMapping).filter((key) => configMapping[key].name !== undefined);

const getInitData = () => {
    const data = {};
    Object.keys(configMapping).forEach((key) => {
        data[key] = configMapping[key].default ?? null;
    });
    return data;
};

/**
 * Reads server response into a plain object (does NOT touch any reactive state).
 * Returns the mapped values so callers can decide what to do with them.
 */
const mapServerData = (source) => {
    const result = {};

    writableKeys.forEach((key) => {
        const { name, default: defaultValue } = configMapping[key];
        result[key] = source?.[name] ?? defaultValue ?? null;
    });

    // Locally-calculated opencl lists
    result.opencl_device_list = [{ label: "None", value: -1 }];
    result.opencl_device_list_relidx = [];
    const list = source?.["Node.opencl_device_list"];
    if (list) {
        for (const [i, device] of list.entries()) {
            result.opencl_device_list.push({ label: device[0], value: i });
            result.opencl_device_list_relidx.push({ name: device[0], index: device[1] });
        }
    }

    return result;
};

export function useConfigData() {
    const setConfig = useSetConfig();

    const { data: queryData, isPending, isError } = useConfig();
    const loading = computed(() => isPending.value || isError.value);

    const data = reactive(getInitData());

    // Snapshot of the last values written from the server.
    // Used to distinguish server-sync writes from user edits.
    const serverSnapshot = { ...getInitData() };

    // ── Server → data sync ────────────────────────────────────────────────────
    // Runs only when queryData changes (i.e. a fresh server response arrives).
    // Writes values into `data` and updates the snapshot so the per-key watchers
    // below know these are not user-initiated changes.
    watch(
        queryData,
        (source) => {
            if (!source) return;
            const mapped = mapServerData(source);
            Object.keys(mapped).forEach((key) => {
                serverSnapshot[key] = mapped[key];
                data[key] = mapped[key];
            });
        },
        { immediate: true }
    );

    // ── data → server sync ────────────────────────────────────────────────────
    // One watcher per writable key. Fires only when the user changes a value in
    // the UI. We skip the trigger if the new value matches the last server value
    // (i.e. the change came from the server sync above, not from the user).
    writableKeys.forEach((key) => {
        watch(
            () => data[key],
            (value) => {
                // Ignore writes that originated from the server sync.
                if (value === serverSnapshot[key]) return;
                const configKey = configMapping[key].name;
                setConfig.mutate({ ...configMapping[key], key: configKey, value });
            }
        );
    });

    // ── Derived flags ─────────────────────────────────────────────────────────
    const isWallet = computed(() => {
        if (!queryData.value) return false;
        const val = queryData.value?.wallet;
        return val || val == null ? true : false;
    });

    const isFarmer = computed(() => {
        if (!queryData.value) return false;
        const val = queryData.value?.farmer;
        return val || val == null ? true : false;
    });

    const isLocalNode = computed(() => {
        if (!queryData.value) return null;
        const val = queryData.value?.local_node;
        return val || val == null ? true : false;
    });

    const $q = useQuasar();
    watch(
        isPending,
        () => {
            const group = "useConfigData";
            if (isPending.value) {
                $q.loading.show({ group });
            } else {
                $q.loading.hide(group);
            }
        },
        { immediate: true }
    );

    return { data, loading, isWallet, isFarmer, isLocalNode };
}
