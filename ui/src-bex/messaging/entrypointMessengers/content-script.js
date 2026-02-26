// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/content-script";
import { sendMessageWrapper, onMessageWrapper, allowWindowMessagingWrapper } from "../messengerWrapper";

const contentScriptMessenger = {
    sendMessageAsync: sendMessageWrapper(messenger),
    onMessage: onMessageWrapper(messenger),
    allowWindowMessaging: allowWindowMessagingWrapper(messenger),
};

export default contentScriptMessenger;
