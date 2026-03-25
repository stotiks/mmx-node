import openNotificationAsync from "./openNotification";
import backgroundMessenger from "@bex/messaging/entrypointMessengers/background";

const sendMessageAsync = async (payload) => {
    return await backgroundMessenger.sendMessageAsync("notification/request", payload, "popup");
};

const notificationMessenger = {
    openNotificationAsync,
    sendMessageAsync,
};

export default notificationMessenger;
