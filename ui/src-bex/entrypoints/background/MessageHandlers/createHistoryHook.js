import { JSONbigNativeString } from "@/mmx/wallet/utils/JSONbigNative";
import vault from "../stores/vault";

class Context {
    #stringify(...options) {
        return JSONbigNativeString.stringify(this, ...options);
    }

    toString() {
        return this.#stringify();
    }

    toJSON() {
        return JSONbigNativeString.parse(JSONbigNativeString.stringify({ ...this }));
    }
}
export const createHistoryHook = () => {
    return async (context) => {
        const { handler, result } = context;
        const isAcceptRequired = handler.metadata?.isAcceptRequired ?? true;
        if (isAcceptRequired) {
            const { data, ...restResult } = result;

            const ctx = Object.assign(new Context(), { ...context, result: restResult });
            vault.addHistoryAsync(ctx);
        }
    };
};
