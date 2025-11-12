import { syncFunctionList as functionList } from "@/mmx/wallet/common/ECDSAUtils/ECDSAUtils";

self.onmessage = function (e) {
    const { fnName, args } = e.data;
    try {
        const fn = functionList[fnName];
        if (fn) {
            const result = fn.apply(null, Object.values(args));
            self.postMessage({ success: true, result });
        } else {
            throw new Error(`Unknown fnName: ${fnName}`);
        }
    } catch (error) {
        self.postMessage({
            success: false,
            error,
        });
    }
};
