import { syncFunctionList as functionList } from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionWithCallbacks } from "./execFunction";

export const executeECDSAFunctionWithCallbacks = (fnName, args, resolve, reject) =>
    executeFunctionWithCallbacks(fnName, args, functionList, resolve, reject);
