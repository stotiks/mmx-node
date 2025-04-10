import { openNotification } from "@bex/utils/openNotification";
import { internalMessenger } from "@bex/utils/messaging";

export const notificationMessaging = {
    sendMessage: async (message) => {
        try {
            await internalMessenger.sendMessage("notification", { method: "ping" });
        } catch (e) {
            const popup = await openNotification();
        }

        await internalMessenger.sendMessage("notification", message);
    },
};
