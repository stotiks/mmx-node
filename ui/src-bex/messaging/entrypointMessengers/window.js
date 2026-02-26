// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/window";
import { sendMessageWrapper, onMessageWrapper, setNamespaceWrapper } from "../messengerWrapper";

const windowMessenger = {
    sendMessageAsync: sendMessageWrapper(messenger),
    onMessage: onMessageWrapper(messenger),
    setNamespace: setNamespaceWrapper(messenger),
};

export default windowMessenger;
