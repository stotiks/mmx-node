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
    if (response?.success != null) {
        const { success, data, error } = response;
        if (success) {
            return data;
        } else {
            throw new Error(error || "Unknown error occurred");
        }
    } else {
        //console.error("Invalid response:", response);
        throw new Error("Invalid response: " + response);
    }
};

export const messengerWrapper = (messenger) => ({
    sendMessageAsync: sendMessageWrapper(messenger.sendMessage),
    onMessage: (messageID, callback) => messenger.onMessage(messageID, callbackGuard(callback)),
    onWindowMessage: messenger.onMessage,
    allowWindowMessaging: messenger.allowWindowMessaging?.bind(null, namespace),
    setNamespace: messenger.setNamespace?.bind(null, namespace),
});
