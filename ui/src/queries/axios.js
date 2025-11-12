import axiosLib from "axios";

//axiosLib.defaults.timeout = 10000;

axiosLib.defaults.paramsSerializer = (params) => {
    return Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
};

const axios = axiosLib.create();

axios.interceptors.request.use(
    (config) => {
        if (config.url.startsWith("/wapi/")) {
            const appStore = useAppStore();
            config.baseURL = appStore.wapiBaseUrl ?? "/wapi/";
            config.url = config.url.replace("/wapi/", "/");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
