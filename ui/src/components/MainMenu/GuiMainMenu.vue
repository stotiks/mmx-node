<template>
    <MenuTabs :tabs="tabs" />
</template>

<script setup>
import { mdiCog, mdiLogout, mdiFinance, mdiSwapHorizontal } from "@mdi/js";

import BuildVersion from "./components/BuildVersion.vue";
import NodeStatus from "./components/NodeStatus.vue";
import Logo from "./components/Logo/index.vue";

const { t } = useI18n();
const appStore = useAppStore();

const { isWallet, isFarmer } = useConfigData();

const tabs = computed(() => [
    { component: Logo },
    { separator: true },
    { to: "/node", label: t("main_menu.node") },
    { to: "/wallet", label: t("main_menu.wallet"), visible: isWallet.value },
    { to: "/farmer", label: t("main_menu.farmer"), visible: isFarmer.value },
    { to: "/explore", label: t("main_menu.explore") },
    { space: true },
    { to: "/market", label: t("main_menu.market"), visible: isWallet.value, icon: mdiFinance },
    { to: "/swap", label: t("main_menu.swap"), visible: isWallet.value, icon: mdiSwapHorizontal },
    { space: true },
    { component: BuildVersion, visible: !appStore.isWinGUI },
    { component: NodeStatus },
    { to: "/settings", icon: mdiCog },
    ...(!appStore.isGUI ? [{ icon: mdiLogout, click: handleLogout }] : []),
]);

import { useLogout } from "@/queries/server";
const logout = useLogout();
const handleLogout = () => logout.mutate();

useNodeSession();
</script>
