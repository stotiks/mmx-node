import { executeECDSAFunctionAsync } from "./utils/execECDSAFunctionAsync";
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
            const execFn = async () => await executeECDSAFunctionAsync(fnName, args).then(resolve).catch(reject);

            if (typeof queueMicrotask !== "undefined") {
                queueMicrotask(execFn);
            } else {
                setTimeout(execFn, 0);
            }
        }
    });
};
