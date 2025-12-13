import * as ecdsaFunctions from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionWithCallbacks, getSyncFunctions } from "./execFunction";

export const executeECDSAFunctionWithCallbacks = (fnName, args, resolve, reject) =>
    executeFunctionWithCallbacks(fnName, args, getSyncFunctions(ecdsaFunctions), resolve, reject);
