// eslint-disable-next-line no-restricted-imports
import {
    onMessage as _onMessage,
    sendMessage as _sendMessage,
    allowWindowMessaging as _allowWindowMessaging,
} from "webext-bridge/content-script";

import { namespace } from "@bex/messaging/utils/namespace";
export const allowWindowMessaging = () => _allowWindowMessaging(namespace);

import { callbackGuard } from "./utils/callbackGuard";
import { sendMessageWrapper } from "./utils/sendMessageWrapper";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));
const sendMessageAsync = sendMessageWrapper(_sendMessage);

export const contentMessenger = {
    onMessage,
    sendMessageAsync,
};
