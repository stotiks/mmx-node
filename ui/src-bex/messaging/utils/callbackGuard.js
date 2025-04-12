// eslint-disable-next-line no-restricted-imports
import { isInternalEndpoint } from "webext-bridge";

// https://serversideup.net/open-source/webext-bridge/docs/guide/security
export const callbackGuard = (callback) => (message) => {
    const { sender, id } = message;

    // Respond only if request is from 'devtools', 'content-script', 'popup', 'options', or 'background' endpoint
    if (isInternalEndpoint(sender)) {
        return callback(message);
    } else {
        console.error(`Invalid sender: [${sender.context}] for message [${id}]`);
        throw new Error("Invalid sender");
    }
};
