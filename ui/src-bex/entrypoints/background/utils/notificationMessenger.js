import { openNotification } from "@bex/entrypoints/background/utils/openNotification";
import { backgroundMessenger } from "@bex/messaging/background";

const sendMessageAsync = async (payload) =>
    await backgroundMessenger.sendMessageAsync("notification", payload, "popup");

export const notificationMessenger = {
    sendMessage: async (payload) => {
        await openNotification();
        await sendMessageAsync(payload);
    },
};
