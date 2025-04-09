export class MessageHandlerBase {
    static handle(message) {
        const { method, params } = message.data;

        const handler = this[method];
        if (!handler) {
            throw new Error(`unknown method: ${method}`);
        }
        const result = handler.call(this, params);
        return result instanceof Promise ? result : Promise.resolve(result);
    }
}
