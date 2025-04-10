/*global chrome browser*/
/*eslint no-undef: "error"*/

import { defineBackground } from "#imports";
import { randomSeed, seedToWords } from "@/mmx/wallet/mnemonic";
import { internalMessenger } from "@bex/utils/messaging";
import vault from "./Vault";
import { RequestMessageHandler } from "./MessageHandler/RequestMessageHandler";

const openPopup = () =>
    chrome.windows.getCurrent((currentWindow) => {
        const rightOffset = 80;
        const topOffset = 80;

        const width = 400;
        const height = 600;

        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width,
            height,
            focused: true,
            top: currentWindow.top + topOffset,
            left: currentWindow.left + currentWindow.width - width - rightOffset,
        });
    });

export default defineBackground(() => {
    console.log("Hello from background world!");

    //openPopup();
    // browser.runtime.onInstalled.addListener(async ({ reason }) => {
    //     if (reason !== "install") return;
    //     // Open a tab on install
    //     await browser.tabs.create({
    //         url: browser.runtime.getURL("popup.html"),
    //         active: true,
    //     });
    // });
    // const seed = randomSeed();
    // console.log(seedToWords(seed));

    const initializeExtension = async () => {
        await vault.removeData();
        await vault.unlock("password");
        await vault.addWallet(randomSeed());
        await vault.addWallet(randomSeed());
        await vault.addWallet(randomSeed());
    };

    initializeExtension();

    internalMessenger.onMessage("request", async (message) => {
        return await RequestMessageHandler.handle(message);
    });
});
