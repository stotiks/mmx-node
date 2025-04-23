/*global browser*/

let notificationWindowId = null;
let isNotificationLoaded = false;

export const openNotification = async () => {
    if (notificationWindowId) {
        const views = await browser.runtime.getContexts({ windowIds: [notificationWindowId] });
        if (views.length > 0) {
            await browser.windows.update(notificationWindowId, { focused: true });
        } else {
            notificationWindowId = null;
        }
    }

    if (notificationWindowId) {
        //console.log("Notification is already open.");
    } else {
        const currentWindow = await browser.windows.getCurrent();

        const rightOffset = 80;
        const topOffset = 80;
        const width = 570;
        const height = 600;

        const newWindow = await browser.windows.create({
            url: browser.runtime.getURL("notification.html"),
            type: "popup",
            width,
            height,
            focused: true,
            top: currentWindow.top + topOffset,
            left: currentWindow.left + currentWindow.width - width - rightOffset,
        });

        notificationWindowId = newWindow.id;
        const tabId = newWindow.tabs[0].id;

        browser.tabs.onUpdated.addListener(function listener(tabIdUpdated, changeInfo) {
            if (tabId === tabIdUpdated && changeInfo.status === "complete") {
                browser.tabs.onUpdated.removeListener(listener);
                isNotificationLoaded = true;
                //console.log("Window content fully loaded");
            }
        });

        browser.tabs.onRemoved.addListener(function listener(tabIdUpdated) {
            if (tabId === tabIdUpdated) {
                browser.tabs.onRemoved.removeListener(listener);
                isNotificationLoaded = false;
                //console.log("Window closed");
            }
        });
    }

    return new Promise((resolve) => {
        const checkPopupLoaded = setInterval(() => {
            if (isNotificationLoaded) {
                clearInterval(checkPopupLoaded);
                resolve();
            }
        }, 100);
    });
};
