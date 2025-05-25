import { defineContentScript, injectScript } from "#imports";
import { contentScriptMessenger } from "@bex/messaging/content-script";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main(ctx) {
        console.log("Hello content.");

        await injectScript("/inpage.js", {
            keepInDom: false,
        });

        contentScriptMessenger.allowWindowMessaging();

        // sendMessage to window example
        // debug/test; remove in production
        setInterval(() => {
            contentScriptMessenger.sendMessageAsync("message", { eventName: "ping", data: "pong" }, "window");
        }, 1000);
    },
});
