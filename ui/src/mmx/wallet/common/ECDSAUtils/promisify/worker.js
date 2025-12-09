import { syncFunctionList as functionList } from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionWithCallbacks } from "./utils/executeFunction";

self.onmessage = function (e) {
    const { fnName, args } = e.data;
    const resolve = (result) => self.postMessage({ success: true, result });
    const reject = (error) => self.postMessage({ success: false, error });
    executeFunctionWithCallbacks(fnName, args, functionList, resolve, reject);
};
