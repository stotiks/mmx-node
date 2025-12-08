import { syncFunctionList as functionList } from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";
import PromisifyWorker from "./worker?worker&inline";

export const promisify = (fnName, args) => {
    return new Promise((resolve, reject) => {
        if (typeof process === "undefined" && typeof window !== "undefined" && window.Worker) {
            const worker = new PromisifyWorker();
            worker.postMessage({ fnName: fnName, args });
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
            const exec = () => {
                try {
                    const fn = functionList[fnName];
                    if (fn) {
                        const result = fn.apply(null, Object.values(args));
                        resolve(result);
                    } else {
                        throw new Error(`Unknown fnName: ${fnName}`);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            if (typeof queueMicrotask !== "undefined") {
                queueMicrotask(exec);
            } else {
                setTimeout(exec);
            }
        }
    });
};
