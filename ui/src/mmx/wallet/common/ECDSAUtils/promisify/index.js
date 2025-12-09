import { syncFunctionList as functionList } from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import { executeFunctionWithCallbacks } from "./utils/executeFunction";
import PromisifyWorker from "./worker?worker&inline";

export const promisify = (fnName, args) => {
    return new Promise((resolve, reject) => {
        if (typeof process === "undefined" && typeof window !== "undefined" && window.Worker) {
            const worker = new PromisifyWorker();
            worker.postMessage({ fnName, args });
            worker.onmessage = function (e) {
                const { success, result, error } = e.data;
                if (success) {
                    resolve(result);
                } else {
                    reject(error);
                }
            };
            worker.onerror = reject;
        } else {
            const exec = () => executeFunctionWithCallbacks(fnName, args, functionList, resolve, reject);

            if (typeof queueMicrotask !== "undefined") {
                queueMicrotask(exec);
            } else {
                setTimeout(exec, 0);
            }
        }
    });
};
