/**
 * Creates a pre-hook that blocks all calls to getECDSAWalletAsync method
 *
 * This hook prevents external access to the ECDSA wallet retrieval functionality
 * via message-based communication. It checks the resolved handler name and throws
 * an error if the method being called is getECDSAWalletAsync.
 *
 * @returns {Function} Pre-hook function that receives context and throws error if blocked
 */
const createBlockECDSAWalletHook = () => {
    return async (context) => {
        const { handler } = context;

        // The handler object contains the resolved method name
        // handler.name is the actual method name that will be called
        const methodName = handler?.name;

        // Check if the resolved method name is getECDSAWalletAsync
        if (methodName === "getECDSAWalletAsync") {
            throw new Error("Access to getECDSAWalletAsync is blocked");
        }
    };
};

export default createBlockECDSAWalletHook;
