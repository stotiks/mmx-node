import openNotificationAsync from "./openNotification";
import backgroundMessenger from "@bex/messaging/entrypointMessengers/background";

const _sendMessageAsync = async (payload) =>
    await backgroundMessenger.sendMessageAsync("notification/request", payload, "popup");

const sendMessageAsync = async (payload) => {
    await openNotificationAsync();
    return await _sendMessageAsync(payload);
};

const notificationMessenger = {
    sendMessageAsync,
};

export default notificationMessenger;
