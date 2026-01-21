import { defineContentScript, injectScript } from "#imports";
import contentScriptMessenger from "@bex/messaging/entrypointMessengers/content-script";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main(ctx) {
        console.log("Hello content.");

        await injectScript("/inpage.js", {
            keepInDom: false,
        });

        contentScriptMessenger.allowWindowMessaging();

        // Debug/test interval - only runs in development mode
        if (process.env.NODE_ENV === "development") {
            setInterval(() => {
                contentScriptMessenger.sendMessageAsync("message", { eventName: "ping", data: "pong" }, "window");
            }, 1000);
        }
    },
});
