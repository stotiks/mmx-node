// eslint-disable-next-line no-restricted-imports
import { onMessage as _onMessage, sendMessage } from "webext-bridge/background";

import { callbackGuard } from "./utils/callbackGuard";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));

const onWindowMessage = _onMessage;

export const internalMessenger = {
    onMessage,
    onWindowMessage,
    sendMessage,
};
