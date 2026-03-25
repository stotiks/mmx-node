import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";

const createSetResultHook = () => {
    const setResultHook = async (context) => {
        await notificationMessenger.sendMessageAsync({
            method: "setResult",
            params: context,
        });
    };

    return setResultHook;
};

export default createSetResultHook;
