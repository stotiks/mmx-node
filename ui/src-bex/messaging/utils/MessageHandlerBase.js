const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandlerBase {
    static async handleAsync(message) {
        const { method: _method, params } = message.data;

        const method = toCamelCase(_method);
        const handler = this[method];
        if (!handler) {
            return {
                success: false,
                error: `unknown method: ${_method}`,
            };
        }

        try {
            const result = await handler.call(this, params);
            return { success: true, data: result };
        } catch (error) {
            // eslint-disable-next-line no-undef
            if (process.env.NODE_ENV === "development") {
                console.log(`Error handling method [${_method}]:`, error);
            }

            return {
                success: false,
                error: error.message,
            };
        }
    }
}
