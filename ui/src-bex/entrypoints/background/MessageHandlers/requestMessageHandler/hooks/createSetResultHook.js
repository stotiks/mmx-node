import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

const createSetResultHook = () => {
    const setResultHook = async (context) => {
        const { handler } = context;
        const isAcceptRequired = handler.body.metadata?.isAcceptRequired ?? true;

        if (!isAcceptRequired) {
            return;
        }

        // no await, fire-and-forget
        notificationMessenger
            .sendMessageAsync({
                method: "setResult",
                params: {
                    handler: { name: context.handler.name },
                    result: context.result,
                },
            })
            .catch((err) => {
                console.warn("[SetResultHook] Failed to set result:", err);
            });
    };

    return setResultHook;
};

export default createSetResultHook;
