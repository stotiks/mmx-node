// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/popup";
import { sendMessageWrapper, onMessageWrapper } from "../messengerWrapper";

const popupMessenger = {
    sendMessageAsync: sendMessageWrapper(messenger),
    onMessage: onMessageWrapper(messenger),
};

export default popupMessenger;
