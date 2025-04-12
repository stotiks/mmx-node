import { onMessage as _onMessage, sendMessage } from "webext-bridge/popup";

import { callbackGuard } from "./utils/callbackGuard";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));

export const internalMessenger = { onMessage, sendMessage };
