import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";
const createSetResultHook = () => {
    return async (context) => {
        await notificationMessenger.sendMessageAsync({
            method: "setResult",
            params: context,
        });
    };
};

export default createSetResultHook;
