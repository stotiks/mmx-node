import { defineBackground } from "#imports";
import { randomSeed, seedToWords } from "@/mmx/wallet/mnemonic";
import { internalMessenger } from "@bex/utils/messaging";
import vault from "./Vault";
import { RequestMessageHandler } from "./MessageHandler/RequestMessageHandler";

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

    setInterval(() => {
        internalMessenger.sendMessage("notification", 123);
    }, 1000);

    internalMessenger.onMessage("request", async (message) => {
        return await RequestMessageHandler.handle(message);
    });
});
