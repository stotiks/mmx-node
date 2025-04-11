import { defineBackground } from "#imports";
import { randomSeed } from "@/mmx/wallet/mnemonic";
import { internalMessenger } from "@bex/messaging/background";
import { RequestMessageHandler } from "./MessageHandler/RequestMessageHandler";
import vault from "./Vault";

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

    internalMessenger.onWindowMessage("request", async (message) => {
        console.log("request:", message);
        return await RequestMessageHandler.handle(message);
    });
});
