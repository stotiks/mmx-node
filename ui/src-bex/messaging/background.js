// eslint-disable-next-line no-restricted-imports
import { onMessage as _onMessage, sendMessage as _sendMessage } from "webext-bridge/background";

import { callbackGuard } from "./utils/callbackGuard";
import { sendMessageWrapper } from "./utils/sendMessageWrapper";

const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));
const onWindowMessage = _onMessage;
const sendMessageAsync = sendMessageWrapper(_sendMessage);

export const backgroundMessenger = {
    onMessage,
    onWindowMessage,
    sendMessageAsync,
};
