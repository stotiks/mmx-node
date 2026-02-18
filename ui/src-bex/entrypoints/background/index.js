import { defineBackground } from "#imports";
import backgroundMessenger from "@bex/messaging/entrypointMessengers/background";
import vaultMessageHandler from "./MessageHandlers/vaultMessageHandler";
import requestMessageHandler from "./MessageHandlers/requestMessageHandler";
import vault from "@bex/entrypoints/background/vault";

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
        //process messages from injected provider
        requestMessageHandler.register(backgroundMessenger.onWindowMessage, "provider/request");

        //process messages from popup
        vaultMessageHandler.register(backgroundMessenger.onMessage, "popup/vault");

        // //process messages from notification
        // vaultMessageHandler.register(backgroundMessenger.onMessage, "notification/vault");

        //forward events from vault to popup/notification
        vault.on("<any>", async (eventName, params) => {
            try {
                await backgroundMessenger.sendMessageAsync("popup/vault", { method: eventName, params }, "popup");
            } catch (err) {
                console.log(err);
            }

            // try {
            //     await backgroundMessenger.sendMessageAsync(
            //         "notification/vault",
            //         { method: eventName, params },
            //         "popup"
            //     );
            // } catch (err) {
            //     console.log(err);
            // }
        });
    };

    initializeExtension();
});
