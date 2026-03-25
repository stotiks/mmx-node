import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

const createSetResultHook = () => {
    const setResultHook = async (context) => {
        const { handler } = context;
        const isAcceptRequired = handler.body.metadata?.isAcceptRequired ?? true;

        if (!isAcceptRequired) {
            return;
        }

        await notificationMessenger.sendMessageAsync({
            method: "setResult",
            params: {
                handler: { name: context.handler.name },
                result: context.result,
            },
        });
    };

    return setResultHook;
};

export default createSetResultHook;
