import { openNotificationAsync } from "@bex/entrypoints/background/utils/openNotification";
import { backgroundMessenger } from "@bex/messaging/entrypointMessengers/background";

const _sendMessageAsync = async (payload) =>
    await backgroundMessenger.sendMessageAsync("notification", payload, "popup");

const sendMessageAsync = async (payload) => {
    await openNotificationAsync();
    return await _sendMessageAsync(payload);
};

export const notificationMessenger = {
    sendMessageAsync,
};
