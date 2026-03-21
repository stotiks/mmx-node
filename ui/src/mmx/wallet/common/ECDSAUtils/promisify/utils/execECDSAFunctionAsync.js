import * as ecdsaFunctions from "@mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionAsync } from "./execFunctionAsync";

export const executeECDSAFunctionAsync = async (fnName, args) =>
    await executeFunctionAsync(fnName, args, ecdsaFunctions);
