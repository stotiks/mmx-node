import { executeECDSAFunctionWithCallbacks } from "./utils/execECDSAFunction";

self.onmessage = async (event) => {
    const { fnName, args } = event.data;
    const resolve = (result) => self.postMessage({ success: true, result });
    const reject = (error) => self.postMessage({ success: false, error });
    await executeECDSAFunctionWithCallbacks(fnName, args, resolve, reject);
};
