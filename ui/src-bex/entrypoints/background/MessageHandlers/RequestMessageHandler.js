import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { notificationMessenger } from "../utils/notificationMessenger";
import { RequestMessageHandlerMethods } from "./RequestMessageHandlerMethods";

import vault from "../stores/vault";

/* global browser */
const getTabUrl = async (tabId) => {
    const tab = await browser.tabs.get(tabId);
    const url = new URL(tab.url);
    return url;
};

class MessageHandlerWithAuth extends MessageHandlerBase {
    async requestPermissionsAndAcceptAsync(message) {
        console.log("Checking permissions...");

        if (message.sender.frameId != null) {
            throw new Error("iFrame not supported");
        }

        const tabId = message.sender.tabId;
        const url = await getTabUrl(tabId);

        const isAcceptRequired = this.getHandlerData(message).handler.metadata?.isAcceptRequired ?? true;

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

        return { hasPermissions, hasAccept };
    }

    async handleAsync(message) {
        const { hasPermissions, hasAccept } = await this.requestPermissionsAndAcceptAsync(message);

        if (hasPermissions === true && hasAccept === true) {
            return await super.handleAsync(message);
        } else {
            if (!hasPermissions) {
                throw new Error("Permissions not granted");
            }

            if (!hasAccept) {
                throw new Error("Request not accepted");
            }
        }
    }
}

export const requestMessageHandler = new MessageHandlerWithAuth(RequestMessageHandlerMethods);
