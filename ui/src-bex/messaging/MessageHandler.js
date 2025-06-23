const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandler {
    #methods;
    #hooks = [];

    constructor(methods) {
        this.#methods = methods;
    }

    addHook(hook) {
        this.#hooks.push(hook);
    }

    async #runHooks(context) {
        for (const hook of this.#hooks) {
            await hook(context);
        }
    }

    #findHandler(method) {
        if (typeof method !== "string" || !method) {
            return undefined;
        }

        const methodCC = toCamelCase(method);

        const potentialHandlerNames = [
            method, // Original method name (e.g., "do-something")
            methodCC, // Camel-cased version (e.g., "doSomething")
            `${methodCC}Async`, // Camel-cased with "Async" suffix (e.g., "doSomethingAsync")
            methodCC.replace(/Async$/, ""), // Camel-cased with "Async" suffix removed
        ];

        let foundHandler;

        for (const handlerName of new Set(potentialHandlerNames)) {
            const handler = this.#methods[handlerName];
            if (typeof handler === "function") {
                foundHandler = handler;
                break;
            }
        }

        return foundHandler;
    }

    getHandlerData(message) {
        const { method, params } = message.data;
        const handler = this.#findHandler(method);

        if (!handler) {
            // Enhanced error message for better debugging.
            throw new Error(`No function handler found for method: ${method}`);
        }

        return {
            handler,
            method,
            params,
        };
    }

    async handleAsync(message) {
        const { handler, method, params } = this.getHandlerData(message);
        const context = { message, handler, method, params };

        try {
            await this.#runHooks(context);
            const result = await handler.call(this.#methods, params);
            return { success: true, data: result };
        } catch (error) {
            // eslint-disable-next-line no-undef
            if (process.env.NODE_ENV === "development") {
                console.log(`Error handling method [${method}]:`, error);
            }
            return { success: false, error: error.message };
        }
    }

    register(onWindowMessage, messageID) {
        onWindowMessage(messageID, async (message) => {
            console.log(`Received [${messageID}] message:`, JSON.parse(JSON.stringify(message)));
            return await this.handleAsync(message);
        });
    }
}
