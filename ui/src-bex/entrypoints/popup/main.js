const isNotification = new URLSearchParams(location.search).get("notification") === "true";

import { createBexApp } from "@bex/entrypoints/popup/createBexApp";
createBexApp({ isNotification });
