const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandlerBase {
    static getHandlerObj() {
        return this;
    }

    static getHandlerData(message) {
        const { method: method, params } = message.data;
        const methodCC = toCamelCase(method);

        const ho = this.getHandlerObj();
        const handler = ho[method] ?? ho[methodCC] ?? ho[methodCC + "Async"] ?? ho[methodCC.replace(/Async$/, "")];

        const callFnAsync =
            handler &&
            (async () => {
                return await handler.call(ho, params);
            });

        return {
            callFnAsync,
            handler,
            method,
            params,
        };
    }

    static async handleAsync(message) {
        const { callFnAsync, handler, method } = this.getHandlerData(message);

        if (!callFnAsync || handler.name == "handleAsync" || handler.name == "getHandlerObj") {
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
}
