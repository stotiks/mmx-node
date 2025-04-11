import { onMessage, sendMessage, setNamespace } from "webext-bridge/window";
export const windowMessenger = { onMessage, sendMessage };

import { namespace } from "./utils/namespace";
setNamespace(namespace);
