import { defineBackground } from "#imports";
import { backgroundMessenger } from "@bex/messaging/entrypointMessengers/background";
import { vaultMessageHandler } from "./MessageHandlers/VaultMessageHandler";
import { requestMessageHandler } from "./MessageHandlers/RequestMessageHandler";
import vault from "./stores/vault";

export default defineBackground(() => {
    console.log("Hello from background world!");

    // browser.runtime.onInstalled.addListener(async ({ reason }) => {
    //     if (reason !== "install") return;
    //     // Open a tab on install
    //     await browser.tabs.create({
    //         url: browser.runtime.getURL("popup.html"),
    //         active: true,
    //     });
    // });

    const initializeExtension = async () => {
        //await vault.initAsync();
        //await vault.removeDataAsync();

        //process messages from injected provider
        requestMessageHandler.register(backgroundMessenger.onWindowMessage, "request");

        //process messages from popup/notification
        vaultMessageHandler.register(backgroundMessenger.onWindowMessage, "vault");

        //forward events from vault to popup
        vault.on("<any>", async (eventName, params) => {
            try {
                await backgroundMessenger.sendMessageAsync("vault", { method: eventName, params }, "popup");
            } catch (err) {
                console.log(err);
            }
        });
    };

    initializeExtension();
});
