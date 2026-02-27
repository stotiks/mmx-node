import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

import vault from "@bex/entrypoints/background/vault";

/* global browser */
const getTabUrl = async (tabId) => {
    const tab = await browser.tabs.get(tabId);
    const url = new URL(tab.url);
    return url;
};

const createAuthHook = () => {
    return async (context) => {
        const { message, handler } = context;
        console.log("Checking permissions...");

        if (message.sender.frameId != null) {
            throw new Error("iFrame not supported");
        }

        const tabId = message.sender.tabId;
        const url = await getTabUrl(tabId);

        const isAcceptRequired = handler.body.metadata?.isAcceptRequired ?? true;

        const checkVaultPermissionsAsync = async () => await vault.checkUrlPermissionsAsync(url).catch(() => false);
        const _hasPermissions = (await checkVaultPermissionsAsync()) === true;

        let accepted = false;
        if (isAcceptRequired === true || _hasPermissions === false || vault.getIsUnlocked() === false) {
            const requestPermissionsAndAcceptResponse = await notificationMessenger.sendMessageAsync({
                method: "requestPermissionsAndAccept",
                params: { data: message.data, url: url.href, isAcceptRequired },
            });
            console.log("requestPermissionsAndAcceptResponse:", requestPermissionsAndAcceptResponse);

            accepted = requestPermissionsAndAcceptResponse?.accepted === true;
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

export default createAuthHook;
