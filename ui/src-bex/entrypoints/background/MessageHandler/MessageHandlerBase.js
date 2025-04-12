const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandlerBase {
    static async handle(message) {
        const { method: _method, params } = message.data;

        const method = toCamelCase(_method);
        const handler = this[method];
        if (!handler) {
            throw new Error(`unknown method: ${method}`);
        }
        const result = handler.call(this, params);
        return result instanceof Promise ? result : Promise.resolve(result);
    }
}
