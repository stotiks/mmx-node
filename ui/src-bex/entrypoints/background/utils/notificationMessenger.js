import { openNotification } from "@bex/entrypoints/background/utils/openNotification";
import { backgroundMessenger } from "@bex/messaging/background";

const sendMessageAsync = async (payload) => {
    const { success, data, error } = await backgroundMessenger.sendMessage("notification", payload, "popup");

    if (success) {
        return data;
    } else {
        throw new Error(error || "Unknown error occurred");
    }
};

export const notificationMessenger = {
    sendMessage: async (payload) => {
        await openNotification();
        await sendMessageAsync(payload);
    },
};
