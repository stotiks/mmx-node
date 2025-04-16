import { defineContentScript, injectScript } from "#imports";
import { allowWindowMessaging, contentMessenger } from "@bex/messaging/content";

export default defineContentScript({
    matches: ["<all_urls>"],
    async main(ctx) {
        console.log("Hello content.");

        await injectScript("/inpage.js", {
            keepInDom: false,
        });

        allowWindowMessaging();

        // // sendMessage to window example
        // setInterval(() => {
        //     contentMessenger.sendMessage("message", { eventName: "ping", data: "pong" }, "window");
        // }, 1000);
    },
});
