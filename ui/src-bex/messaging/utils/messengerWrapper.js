const namespace = "8de3d70b-550f-48b3-aaae-c4cb5b798db7";

// eslint-disable-next-line no-restricted-imports
import { isInternalEndpoint } from "webext-bridge";

// https://serversideup.net/open-source/webext-bridge/docs/guide/security
const callbackGuard = (callback) => (message) => {
    const { sender, id } = message;

    // Respond only if request is from 'devtools', 'content-script', 'popup', 'options', or 'background' endpoint
    if (isInternalEndpoint(sender)) {
        return callback(message);
    } else {
        console.error(`Invalid sender: [${sender.context}] for message [${id}]`);
        throw new Error("Invalid sender");
    }
};

const sendMessageWrapper = (sendMessage) => async (messageID, payload, target) => {
    const response = await sendMessage(messageID, payload, target);
    if (response?.success !== undefined) {
        const { success, data, error } = response;
        if (success) {
            return data;
        } else {
            throw new Error(error || "Unknown error occurred");
        }
    } else {
        return response;
    }
};

export const messengerWrapper = (messenger) => {
    const sendMessageAsync = sendMessageWrapper(messenger.sendMessage);
    const onMessage = (messageID, callback) => messenger.onMessage(messageID, callbackGuard(callback));
    const onWindowMessage = messenger.onMessage;

    const messengerWrapped = {
        sendMessageAsync,
        onMessage,
        onWindowMessage,
    };

    if (messenger.allowWindowMessaging) {
        messengerWrapped.allowWindowMessaging = () => messenger.allowWindowMessaging(namespace);
    }

    if (messenger.setNamespace) {
        messengerWrapped.setNamespace = () => messenger.setNamespace(namespace);
    }

    return messengerWrapped;
};
