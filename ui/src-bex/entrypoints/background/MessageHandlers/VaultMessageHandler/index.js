import { MessageHandler } from "@bex/messaging/MessageHandler";
import vault from "@bex/entrypoints/background/Vault";
import { createBlockECDSAWalletHook } from "./hooks/createBlockECDSAWalletHook";
import { createVaultLockHook } from "./hooks/createVaultLockHook";

export const vaultMessageHandler = new MessageHandler(vault);
vaultMessageHandler.addPreHook(createVaultLockHook());
vaultMessageHandler.addPreHook(createBlockECDSAWalletHook());
