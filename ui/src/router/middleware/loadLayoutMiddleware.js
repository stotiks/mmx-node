export const loadLayoutMiddleware = async (to) => {
    if (to.meta.layout === false) {
        to.meta.layoutComponent = null;
        return;
    }

    const layout = to.meta.layout ?? "default";
    const { default: layoutComponent } = await import(`@/layouts/${layout}.vue`);
    to.meta.layoutComponent = layoutComponent;
};
