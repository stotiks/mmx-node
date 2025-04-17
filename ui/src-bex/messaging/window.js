// eslint-disable-next-line no-restricted-imports
import { onMessage as _onMessage, sendMessage as _sendMessage, setNamespace } from "webext-bridge/window";

import { namespace } from "./utils/namespace";
import { callbackGuard } from "./utils/callbackGuard";
import { sendMessageWrapper } from "./utils/sendMessageWrapper";

setNamespace(namespace);

const onMessage = (messageId, callback) => _onMessage(messageId, callbackGuard(callback));
const sendMessageAsync = sendMessageWrapper(_sendMessage);

export const windowMessenger = { onMessage, sendMessageAsync };
