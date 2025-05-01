import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../storage/vault";

export class VaultMessageHandler extends MessageHandlerBase {
    static getHandlerObj = () => vault;
}
