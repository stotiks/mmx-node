// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/window";
import messengerWrapper from "../messengerWrapper";

const windowMessenger = messengerWrapper(messenger);

export default windowMessenger;
