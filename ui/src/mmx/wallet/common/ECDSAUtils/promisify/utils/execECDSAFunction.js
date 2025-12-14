import * as ecdsaFunctions from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionWithCallbacks } from "./execFunction";

export const executeECDSAFunctionWithCallbacks = async (fnName, args, resolve, reject) =>
    await executeFunctionWithCallbacks(fnName, args, ecdsaFunctions, resolve, reject);
