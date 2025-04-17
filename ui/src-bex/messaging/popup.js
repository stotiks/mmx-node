// eslint-disable-next-line no-restricted-imports
import { onMessage as _onMessage, sendMessage as _sendMessage } from "webext-bridge/popup";

import { callbackGuard } from "./utils/callbackGuard";
import { sendMessageWrapper } from "./utils/sendMessageWrapper";

const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));
const sendMessageAsync = sendMessageWrapper(_sendMessage);

export const popupMessenger = { onMessage, sendMessageAsync };
