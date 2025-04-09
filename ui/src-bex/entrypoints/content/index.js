import { defineContentScript, injectScript } from "#imports";
import { websiteMessenger } from "@bex/utils/website-messenging";
import { internalMessenger } from "@bex/utils/messaging";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main(ctx) {
        console.log("Hello content.");

        await injectScript("/inpage.js", {
            keepInDom: false,
        });

        // forward request messages to background
        websiteMessenger.onMessage("request", async ({ data }) => {
            return await internalMessenger.sendMessage("request", data);
        });
    },
});
