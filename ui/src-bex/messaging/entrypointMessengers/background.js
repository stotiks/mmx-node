// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/background";
import messengerWrapper from "../messengerWrapper";

const backgroundMessenger = messengerWrapper(messenger);

export default backgroundMessenger;
