import { useGuiBuildInfo } from "@/queries/local";
//import { mdiRefresh } from "@mdi/js";

export const useAppUpdateChecker = () => {
    if (typeof __BUILD_ID__ === "undefined") {
        return {
            updated: false,
        };
    }

    // eslint-disable-next-line no-undef
    const localBuildId = __BUILD_ID__;

    const updated = ref(false);
    const { data: remoteBuildInfo } = useGuiBuildInfo();

    watchEffect(() => {
        const remoteBuildId = remoteBuildInfo.value?.id;
        // console.log("localBuildId", localBuildId);
        // console.log("remoteBuildId", remoteBuildId);
        updated.value = localBuildId && remoteBuildId && localBuildId != remoteBuildId;
    });

    const $q = useQuasar();
    const route = useRoute();

    const dialogShowing = ref(false);
    watch([updated, () => route.path], () => {
        if (updated.value === true && dialogShowing.value === false) {
            dialogShowing.value = true;
            $q.dialog({
                type: "warning",
                title: t("app_update.title"),
                message: t("app_update.message"),
                persistent: true,
                cancel: true,
                ok: {
                    push: true,
                    color: "negative",
                    label: t("app_update.refresh"),
                    //icon: mdiRefresh,
                    tabIndex: 0,
                },
            })
                .onOk(() => {
                    window.location.reload();
                })
                .onDismiss(() => {
                    dialogShowing.value = false;
                });
        }
    });

    return { updated };
};
