// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/popup";
import { messengerWrapper } from "./utils/messengerWrapper";

export const popupMessenger = messengerWrapper(messenger);
