const getParamNames = (fn) => {
    const fnStr = fn.toString().replace(/\s+/g, " ");
    const params = fnStr.match(/\((.*?)\)/)[1];
    return params ? params.split(",").map((p) => p.trim()) : [];
};

const callWithNamedParams = (fn, params) => {
    // Extract function parameter names
    const paramNames = getParamNames(fn);

    // Create arguments array in correct order
    const args = paramNames.map((name) => params[name]);

    return fn(...args);
};

export { callWithNamedParams };
