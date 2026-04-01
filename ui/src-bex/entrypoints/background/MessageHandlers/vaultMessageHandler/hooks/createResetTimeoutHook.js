export const createResetTimeoutHook = (resetIdleTimeout, methods) => {
    const resetTimeoutHook = async (context) => {
        const { handler } = context;

        if (methods[handler.name]) {
            resetIdleTimeout();
        }
    };

    return resetTimeoutHook;
};
