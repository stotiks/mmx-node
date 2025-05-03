const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandlerBase {
    #handlerMethods;

    constructor(handlerMethods) {
        this.#handlerMethods = handlerMethods;
    }

    getHandlerData(message) {
        const { method: method, params } = message.data;
        const methodCC = toCamelCase(method);

        const hm = this.#handlerMethods;
        const handler = hm[method] ?? hm[methodCC] ?? hm[methodCC + "Async"] ?? hm[methodCC.replace(/Async$/, "")];

        const callFnAsync =
            handler &&
            (async () => {
                return await handler.call(hm, params);
            });

        return {
            callFnAsync,
            handler,
            method,
            params,
        };
    }

    async handleAsync(message) {
        const { callFnAsync, method } = this.getHandlerData(message);

        if (!callFnAsync) {
            return {
                success: false,
                error: `unknown method: ${method}`,
            };
        }

        try {
            const result = await callFnAsync();
            return { success: true, data: result };
        } catch (error) {
            // eslint-disable-next-line no-undef
            if (process.env.NODE_ENV === "development") {
                console.log(`Error handling method [${method}]:`, error);
            }

            return {
                success: false,
                error: error.message,
            };
        }
    }

    register(onWindowMessage, messageID) {
        onWindowMessage(messageID, async (message) => {
            console.log(`Received [${messageID}] message:`, JSON.parse(JSON.stringify(message)));
            try {
                return await this.handleAsync(message);
            } catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
