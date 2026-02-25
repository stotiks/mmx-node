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

    addFailHook(hook) {
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

        for (const name of new Set(potentialHandlerNames)) {
            // Use getOwnPropertyDescriptor to safely check and access the property
            const descriptor = Object.getOwnPropertyDescriptor(this.#methods, name);
            const body = descriptor?.value;
            if (typeof body === "function") {
                return { body, name };
            }
        }

        return null;
    }

    #normalizeErrorMessage(error) {
        const errorMessage = error.message || error;

        // Map known error messages to user-friendly versions
        if (errorMessage === "Transaction was ended before it could complete") {
            return "Request aborted";
        }

        return errorMessage;
    }

    async handleAsync(message) {
        const { method, params } = message.data;
        const handler = this.#findHandler(method);

        if (!handler) {
            // Enhanced error message for better debugging.
            throw new Error(`No function handler found for method: ${method}`);
        }

        const context = { handler, message };
        let result = { success: false, error: "Unknown error" };
        try {
            await this.#runHooksAsync(context);
            const callResult = await handler.body.call(this.#methods, params);
            result = { success: true, data: callResult };
            await this.#runSuccessHooksAsync({ ...context, result });
        } catch (error) {
            const errorMessage = this.#normalizeErrorMessage(error);

            if (process.env.NODE_ENV === "development") {
                console.error(`Error handling method [${method}]:`, errorMessage);
            }

            result = { success: false, error: errorMessage };
            await this.#runFailHooksAsync({ ...context, result });
        }

        await this.#runPostHooksAsync({ ...context, result });

        return result;
    }

    register(onMessage, messageID) {
        onMessage(messageID, async (message) => {
            try {
                console.log(`Received [${messageID}] message:`, JSON.parse(JSON.stringify(message)));
                return await this.handleAsync(message);
            } catch (error) {
                console.error(`Error handling message [${messageID}]:`, error.message || error);
                return { success: false, error: error.message || error };
            }
        });
    }
}
