import { isInternalEndpoint } from "webext-bridge";

export const callbackGuard = (callback) => (message) => {
    const { sender, id } = message;
    if (isInternalEndpoint(sender)) {
        return callback(message);
    } else {
        console.error(`Invalid sender: [${sender.context}] for message [${id}]`);
        throw new Error("Invalid sender");
    }
};
