import { openNotification } from "@bex/entrypoints/background/utils/openNotification";
import { internalMessenger } from "@bex/messaging/background";

export const popupMessenger = {
    sendMessage: async (data) => {
        await openNotification();
        await internalMessenger.sendMessage("popup", data, "popup");
    },
};
