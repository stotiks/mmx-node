const executeFunction = (fnName, args, functionList) => {
    // Input validation
    if (typeof fnName !== "string" || !fnName) {
        throw new Error("Function name must be a non-empty string");
    }

    if (!functionList || typeof functionList !== "object") {
        throw new Error("Function list must be a valid object");
    }

    // Secure property access using hasOwnProperty to prevent prototype pollution
    if (!Object.prototype.hasOwnProperty.call(functionList, fnName)) {
        throw new Error(`Function '${fnName}' is not available`);
    }

    // eslint-disable-next-line security/detect-object-injection
    const fn = functionList[fnName];

    // Additional type check for function
    if (typeof fn !== "function") {
        throw new Error(`'${fnName}' is not a valid function`);
    }

    // Safe argument handling
    const argsArray = args ? Object.values(args) : [];

    return fn.apply(null, argsArray);
};

export const executeFunctionWithCallbacks = (fnName, args, functionList, resolve, reject) => {
    try {
        const result = executeFunction(fnName, args, functionList);
        resolve(result);
    } catch (error) {
        reject(error);
    }
};
