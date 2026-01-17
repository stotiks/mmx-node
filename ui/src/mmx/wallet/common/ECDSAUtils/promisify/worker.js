import { executeECDSAFunctionAsync } from "./utils/execECDSAFunctionAsync";

self.onmessage = async (event) => {
    const { fnName, args } = event.data;
    const resolve = (result) => self.postMessage({ success: true, result });
    const reject = (error) => self.postMessage({ success: false, error });
    await executeECDSAFunctionAsync(fnName, args).then(resolve).catch(reject);
};
