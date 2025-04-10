import { internalMessenger } from "@bex/utils/internalMessenger";

internalMessenger.onMessage("notification", (data) => {
    console.log("Received from background:", data);
});

console.log("Hello from notification world!");
