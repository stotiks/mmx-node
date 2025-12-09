const callWithNamedParams = (fn, params) => {
    const getParamNames = (fn) => {
        const fnStr = fn.toString().replace(/\s+/g, " ");
        const params = fnStr.match(/\((.*?)\)/)[1];
        return params ? params.split(",").map((p) => p.trim()) : [];
    };

    // Extract function parameter names
    const paramNames = getParamNames(fn);

    // Create arguments array in correct order
    const args = paramNames.map((name) => params[name]);

    return fn(...args);
};

const executeFunction = (fnName, args, functionList) => {
    const fn = functionList[fnName];
    if (fn) {
        return callWithNamedParams(fn, args);
    } else {
        throw new Error(`Unknown fnName: ${fnName}`);
    }
};

export const executeFunctionWithCallbacks = (fnName, args, functionList, resolve, reject) => {
    try {
        const result = executeFunction(fnName, args, functionList);
        resolve(result);
    } catch (error) {
        reject(error);
    }
};
