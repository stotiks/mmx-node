import i18n from "@/plugins/i18n";
const t = i18n.global.t;

export default [
    {
        path: "/node",
        component: () => import("@/pages/NodePage"),
        meta: {
            title: () => t("route.node"),
        },
        children: [
            {
                path: "",
                redirect: "/node/log",
            },
            {
                path: "log",
                component: () => import("@/pages/Node/LogIndex"),
            },
            {
                path: "peers",
                component: () => import("@/pages/Node/PeersIndex"),
                meta: {
                    title: () => t("route.peers"),
                },
            },
            {
                path: "blocks",
                component: () => import("@/pages/Explore/BlocksIndex"),
                props: { limit: 20 },
                meta: {
                    title: () => t("route.blocks"),
                },
            },
            {
                path: "netspace",
                component: () => import("@/pages/Node/NetspaceChart"),
                meta: {
                    title: () => t("route.netspace"),
                },
            },
            {
                path: "vdf_speed",
                component: () => import("@/pages/Node/VdfSpeedChart"),
                meta: {
                    title: () => t("route.vdf_speed"),
                },
                alias: [],
            },
            {
                path: "reward",
                component: () => import("@/pages/Node/RewardChart"),
                meta: {
                    title: () => t("route.block_reward"),
                },
                alias: [],
            },
        ],
    },
];
