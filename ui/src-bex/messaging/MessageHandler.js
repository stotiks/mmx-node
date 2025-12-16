const toCamelCase = (str) => {
    return str.replace(/-([a-zA-Z])/g, (match, group1) => group1.toUpperCase());
};

export class MessageHandler {
    #methods;
    #preHooks = [];
    #postHooks = [];
    #successHooks = [];
    #failHooks = [];

    constructor(methods) {
        this.#methods = methods;
    }

    addPreHook(hook) {
        this.#preHooks.push(hook);
    }

    addPostHook(hook) {
        this.#postHooks.push(hook);
    }

    addSuccessHook(hook) {
        this.#successHooks.push(hook);
    }

    addFailsHook(hook) {
        this.#failHooks.push(hook);
    }

    async #executeHooksAsync(context, hooks) {
        for (const hook of hooks) {
            await hook(context);
        }
    }

    async #runHooksAsync(context) {
        await this.#executeHooksAsync(context, this.#preHooks);
    }

    async #runPostHooksAsync(context) {
        await this.#executeHooksAsync(context, this.#postHooks);
    }

    async #runSuccessHooksAsync(context) {
        await this.#executeHooksAsync(context, this.#successHooks);
    }

    async #runFailHooksAsync(context) {
        await this.#executeHooksAsync(context, this.#failHooks);
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

    async handleAsync(message) {
        const { method, params } = message.data;
        const handler = this.#findHandler(method);

        if (!handler) {
            // Enhanced error message for better debugging.
            throw new Error(`No function handler found for method: ${method}`);
        }

        const context = { message, handler };

        let result;
        try {
            await this.#runHooksAsync(context);
            const callResult = await handler.call(this.#methods, params);
            result = { success: true, data: callResult };
            await this.#runSuccessHooksAsync({ ...context, result });
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.log(`Error handling method [${method}]:`, error);
            }
            result = { success: false, error: error.message };
            await this.#runFailHooksAsync({ ...context, result });
        }
        await this.#runPostHooksAsync({ ...context, result });
        return result;
    }

    register(onWindowMessage, messageID) {
        onWindowMessage(messageID, async (message) => {
            console.log(`Received [${messageID}] message:`, JSON.parse(JSON.stringify(message)));
            return await this.handleAsync(message);
        });
    }
}
