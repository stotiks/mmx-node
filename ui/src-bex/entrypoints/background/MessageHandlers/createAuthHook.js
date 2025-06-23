import { notificationMessenger } from "../utils/notificationMessenger";

import vault from "../stores/vault";

/* global browser */
const getTabUrl = async (tabId) => {
    const tab = await browser.tabs.get(tabId);
    const url = new URL(tab.url);
    return url;
};

export const createAuthHook = () => {
    return async (context) => {
        const { message, handler } = context;
        console.log("Checking permissions...");

        if (message.sender.frameId != null) {
            throw new Error("iFrame not supported");
        }

        const tabId = message.sender.tabId;
        const url = await getTabUrl(tabId);

        const isAcceptRequired = handler.metadata?.isAcceptRequired ?? true;

        const checkVaultPermissionsAsync = async () => await vault.checkPermissionsAsync(url).catch(() => false);
        const _hasPermissions = (await checkVaultPermissionsAsync()) === true;

        let accepted = false;
        if (isAcceptRequired === true || _hasPermissions === false) {
            const requestPermissionsAndAcceptResponse = await notificationMessenger.sendMessage({
                method: "requestPermissionsAndAccept",
                params: { data: message.data, url, isAcceptRequired },
            });
            console.log("requestPermissionsAndAcceptResponse:", requestPermissionsAndAcceptResponse);
            accepted = requestPermissionsAndAcceptResponse.data?.accepted === true;
        }

        const hasPermissions = await checkVaultPermissionsAsync();
        const hasAccept = accepted === true || isAcceptRequired === false;

        console.log("requestPermissionsAndAcceptAsync:", { hasPermissions, hasAccept });

        if (!hasPermissions || !hasAccept) {
            const error = !hasPermissions ? "Permissions not granted" : "Request not accepted";
            throw new Error(error);
        }
    };
};
