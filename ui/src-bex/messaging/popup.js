import { onMessage as _onMessage, sendMessage } from "webext-bridge/popup";

import { callbackCleaner } from "./utils/callbackCleaner";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackCleaner(callback));

export const internalMessenger = { onMessage, sendMessage };
