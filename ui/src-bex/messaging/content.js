// eslint-disable-next-line no-restricted-imports
import {
    onMessage as _onMessage,
    sendMessage,
    allowWindowMessaging as _allowWindowMessaging,
} from "webext-bridge/content-script";

import { callbackGuard } from "./utils/callbackGuard";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));

export const contentMessenger = {
    onMessage,
    sendMessage,
};

import { namespace } from "@bex/messaging/utils/namespace";
export const allowWindowMessaging = () => _allowWindowMessaging(namespace);
