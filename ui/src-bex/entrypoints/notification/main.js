import { internalMessenger } from "@bex/messaging/popup";

internalMessenger.onMessage("popup", (message) => {
    console.log("Received from background:", message);
});

console.log("Hello from notification world!");
