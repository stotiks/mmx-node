let routerInstance = null;

export const setRouter = (router) => {
    routerInstance = router;
};

const routerProxy = new Proxy(
    {},
    {
        get(target, prop) {
            if (!routerInstance) {
                throw new Error("Router not initialized");
            }
            const value = routerInstance[prop];
            return typeof value === "function" ? value.bind(routerInstance) : value;
        },
    }
);

export default routerProxy;
