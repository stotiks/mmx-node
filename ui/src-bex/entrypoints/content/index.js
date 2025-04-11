import { defineContentScript, injectScript } from "#imports";
import { allowWindowMessaging } from "@bex/messaging/content";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main(ctx) {
        console.log("Hello content.");

        await injectScript("/inpage.js", {
            keepInDom: false,
        });

        allowWindowMessaging();
    },
});
