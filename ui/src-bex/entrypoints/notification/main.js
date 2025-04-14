import { popupMessenger } from "@bex/messaging/popup";

popupMessenger.onMessage("notification", async (message) => {
    console.log("Received from background:", message);
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return { success: true, data: { message: "Return from notification" } };
});

console.log("Hello from notification world!");
