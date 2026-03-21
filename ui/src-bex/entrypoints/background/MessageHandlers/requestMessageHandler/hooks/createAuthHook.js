/* global browser */

import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

import vault from "@bex/entrypoints/background/vault";

const createAuthHook = () => {
    return async (context) => {
        console.log("Checking permissions...");

        const { message, handler } = context;

        if (message.sender.frameId != null) {
            throw new Error("iFrame not supported");
        }

        if (message.sender.tabId == null) {
            throw new Error("Sender tab not found");
        }

        const tabInfo = await browser.tabs.get(message.sender.tabId);

        if (tabInfo.url == null) {
            throw new Error("Sender tab url not found");
        }

        const url = new URL(tabInfo.url);

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
