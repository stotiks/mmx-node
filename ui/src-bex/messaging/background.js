import { onMessage as _onMessage, sendMessage } from "webext-bridge/background";

import { callbackCleaner } from "./utils/callbackCleaner";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackCleaner(callback));

const onWindowMessage = _onMessage;

export const internalMessenger = {
    onMessage,
    onWindowMessage,
    sendMessage,
};
