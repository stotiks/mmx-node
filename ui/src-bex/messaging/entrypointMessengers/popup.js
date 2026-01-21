// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/popup";
import messengerWrapper from "../messengerWrapper";

const popupMessenger = messengerWrapper(messenger);

export default popupMessenger;
