import { MessageHandlerBase } from "./MessageHandlerBase";
import { getNodeInfo } from "../queries";
import vault from "../Vault";

export class RequestMessageHandler extends MessageHandlerBase {
    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestAccounts = async () => {
        const data = await vault.load();
        return data.wallets.map(({ address }) => address);
    };
}
