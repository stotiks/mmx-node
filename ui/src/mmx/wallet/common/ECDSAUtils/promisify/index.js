import { executeECDSAFunctionWithCallbacks } from "./utils/execECDSAFunction";
import PromisifyWorker from "./worker?worker&inline";

export const promisify = (fnName, args) => {
    return new Promise((resolve, reject) => {
        if (typeof process === "undefined" && typeof window !== "undefined" && window.Worker) {
            const onmessage = (event) => {
                const { success, result, error } = event.data;
                if (success === true) {
                    resolve(result);
                } else {
                    reject(error);
                }
            };

            const worker = new PromisifyWorker();
            worker.onmessage = onmessage;
            worker.onerror = reject;
            worker.postMessage({ fnName, args });
        } else {
            const exec = () => executeECDSAFunctionWithCallbacks(fnName, args, resolve, reject);

            if (typeof queueMicrotask !== "undefined") {
                queueMicrotask(exec);
            } else {
                setTimeout(exec, 0);
            }
        }
    });
};
