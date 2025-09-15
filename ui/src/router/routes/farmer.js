import i18n from "@/plugins/i18n";
const t = i18n.global.t;

export default [
    {
        path: "/farmer",
        component: () => import("@/pages/FarmerPage"),
        meta: {
            title: () => t("route.farmer"),
        },
        children: [
            {
                path: "",
                redirect: "/farmer/plots",
            },
            {
                path: "plots",
                component: () => import("@/pages/Farmer/FarmerPlotsIndex"),
                meta: {
                    title: () => t("route.plots"),
                },
            },
            {
                path: "plotnfts",
                component: () => import("@/pages/Farmer/FarmerPlotNFTsIndex"),
                meta: {
                    title: () => t("route.plotnfts"),
                },
            },
            {
                path: "blocks",
                component: () => import("@/pages/Farmer/FarmerBlocksIndex"),
                meta: {
                    title: () => t("route.blocks"),
                },
            },
            {
                path: "proofs",
                component: () => import("@/pages/Farmer/FarmerProofsIndex"),
                meta: {
                    title: () => t("route.proofs"),
                },
            },
        ],
    },
];
