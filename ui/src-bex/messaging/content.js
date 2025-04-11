import {
    onMessage as _onMessage,
    sendMessage,
    allowWindowMessaging as _allowWindowMessaging,
} from "webext-bridge/content-script";

import { callbackCleaner } from "./utils/callbackCleaner";
const onMessage = (messageId, callback) => _onMessage(messageId, callbackCleaner(callback));

export const internalMessenger = {
    onMessage,
    sendMessage,
};

import { namespace } from "@bex/messaging/utils/namespace";
export const allowWindowMessaging = () => _allowWindowMessaging(namespace);
