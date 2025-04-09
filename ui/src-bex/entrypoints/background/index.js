/*global chrome browser*/
/*eslint no-undef: "error"*/

import { defineBackground } from "#imports";
import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
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
        await vault.unlock("password");
        // const data = await vault.load();
        // console.log("data", data);
        const seed = randomSeed();
        const wallet = new ECDSA_Wallet(seed);

        const data2 = {
            wallets: [
                {
                    address: await wallet.getAddressAsync(0),
                    seed,
                    mnemonic: seedToWords(seed), //debug
                },
            ],
        };

        console.log(data2);

        await vault.save(data2);
    };

    initializeExtension();

    internalMessenger.onMessage("request", async (message) => {
        console.log("request", message);
        return await RequestMessageHandler.handle(message);
    });
});
