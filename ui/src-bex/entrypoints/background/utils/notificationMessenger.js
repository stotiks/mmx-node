import { openNotification } from "@bex/entrypoints/background/utils/openNotification";
import { backgroundMessenger } from "@bex/messaging/background";

const sendMessageAsync = async (payload) =>
    await backgroundMessenger.sendMessageAsync("notification", payload, "popup");

const sendMessage = async (payload) => {
    await openNotification();
    return await sendMessageAsync(payload);
};

export const notificationMessenger = {
    sendMessage,
};
