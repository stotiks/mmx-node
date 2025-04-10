import { internalMessenger } from "@bex/utils/messaging";

internalMessenger.onMessage("notification", (data) => {
    console.log("Received from background:", data);
});

console.log("Hello from notification world!");
