import { defineBackground } from "#imports";
import { backgroundMessenger } from "@bex/messaging/background";
import { PopupMessageHandler } from "./MessageHandlers/PopupMessageHandler";
import { RequestMessageHandler } from "./MessageHandlers/RequestMessageHandler";
import vault from "./storage/vault";

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
        backgroundMessenger.onWindowMessage("request", async (message) => {
            console.log("Received from inpage:", message);
            return await RequestMessageHandler.handle(message);
        });

        //process messages from popup/notification
        backgroundMessenger.onMessage("popup", async (message) => {
            console.log("Received from notification/popup:", message);
            return await PopupMessageHandler.handle(message);
        });

        //forward events from vault to popup
        vault.on("<any>", async (eventName, ...args) => {
            try {
                await backgroundMessenger.sendMessageAsync("vault", { method: eventName, params: args }, "popup");
            } catch (err) {
                console.log(err);
            }
        });
    };

    initializeExtension();
});
