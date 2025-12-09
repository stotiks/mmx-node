import { executeECDSAFunctionWithCallbacks } from "./utils/execECDSAFunction";

self.onmessage = function (e) {
    const { fnName, args } = e.data;
    const resolve = (result) => self.postMessage({ success: true, result });
    const reject = (error) => self.postMessage({ success: false, error });
    executeECDSAFunctionWithCallbacks(fnName, args, resolve, reject);
};
