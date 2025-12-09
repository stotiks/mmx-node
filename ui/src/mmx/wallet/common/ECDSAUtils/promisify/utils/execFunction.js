const executeFunction = (fnName, args, functionList) => {
    const fn = functionList[fnName];
    if (fn) {
        return fn.apply(null, Object.values(args));
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
