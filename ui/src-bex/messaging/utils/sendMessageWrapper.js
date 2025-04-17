export const sendMessageWrapper = (sendMessage) => async (messageID, payload, target) => {
    const response = await sendMessage(messageID, payload, target);

    if (response?.success !== undefined) {
        const { success, data, error } = response;
        if (success) {
            return data;
        } else {
            throw new Error(error || "Unknown error occurred");
        }
    } else {
        return response;
    }
};
