console.log("Hello from notification world!");

import { vueApp } from "../popup/vueApp.js";
vueApp.provide("isNotification", true);
vueApp.mount("#app");
