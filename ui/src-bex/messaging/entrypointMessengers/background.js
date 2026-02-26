// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/background";
import { sendMessageWrapper, onMessageWrapper, onWindowMessageWrapper } from "../messengerWrapper";

const backgroundMessenger = {
    sendMessageAsync: sendMessageWrapper(messenger),
    onMessage: onMessageWrapper(messenger),
    onWindowMessage: onWindowMessageWrapper(messenger),
};

export default backgroundMessenger;
