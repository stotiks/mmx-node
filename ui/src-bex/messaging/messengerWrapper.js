const namespace = "8de3d70b-550f-48b3-aaae-c4cb5b798db7";

// eslint-disable-next-line no-restricted-imports
import { isInternalEndpoint } from "webext-bridge";

const sendMessageWrapper = (sendMessage) => async (messageID, payload, target) => {
    const response = await sendMessage(messageID, payload, target);
    if (response?.success != null) {
        const { success, data, error } = response;
        if (success) {
            return data;
        } else {
            throw new Error(error || "Unsuccessful request");
        }
    } else {
        // //console.error("Invalid response:", response);
        throw new Error("Invalid response: " + response);
        // return response;
    }
};

/**
 * Creates a callback guard that validates the sender endpoint
 * @param {Function} validatorFn - Function that returns true if sender is valid
 * @param {string} description - Description of valid endpoints for error messages
 * @returns {Function} Guard function that wraps the callback
 */
const createEndpointCallbackGuard = (validatorFn, description) => (callback) => (message) => {
    const { sender, id } = message;

    if (validatorFn(sender)) {
        return callback(message);
    }

    console.error(`Invalid sender: [${sender.context}] for message [${id}]. Expected: ${description}`);
    throw new Error("Invalid sender");
};

// https://serversideup.net/open-source/webext-bridge/docs/guide/security
// Respond only if request is from 'devtools', 'content-script', 'popup', 'options', or 'background' endpoint
const internalEndpointCallbackGuard = createEndpointCallbackGuard(
    isInternalEndpoint,
    "internal endpoint (devtools, content-script, popup, options, or background)"
);

const isWindowEndpoint = (sender) => sender.context === "window";
// Respond only if request is from 'window'
const windowEndpointCallbackGuard = createEndpointCallbackGuard(isWindowEndpoint, "window endpoint");

const messengerWrapper = (messenger) => ({
    sendMessageAsync: sendMessageWrapper(messenger.sendMessage),
    onMessage: (messageID, callback) => messenger.onMessage(messageID, internalEndpointCallbackGuard(callback)),
    onWindowMessage: (messageID, callback) => messenger.onMessage(messageID, windowEndpointCallbackGuard(callback)),
    allowWindowMessaging: messenger.allowWindowMessaging?.bind(null, namespace),
    setNamespace: messenger.setNamespace?.bind(null, namespace),
});

export default messengerWrapper;
