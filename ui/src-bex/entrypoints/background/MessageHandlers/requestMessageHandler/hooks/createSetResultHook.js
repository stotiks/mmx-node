import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

const createSetResultHook = () => {
    const setResultHook = async (context) => {
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
