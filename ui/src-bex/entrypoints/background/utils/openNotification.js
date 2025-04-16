/*global chrome browser*/
/*eslint no-undef: "error"*/

let notificationWindowId = null;
let isNotificationLoaded = false;

export const openNotification = async () => {
    if (notificationWindowId) {
        const views = await browser.runtime.getContexts({ windowIds: [notificationWindowId] });
        if (views.length > 0) {
            await chrome.windows.update(notificationWindowId, { focused: true });
        } else {
            notificationWindowId = null;
        }
    }

    if (notificationWindowId) {
        //console.log("Notification is already open.");
    } else {
        const currentWindow = await chrome.windows.getCurrent();

        const rightOffset = 80;
        const topOffset = 80;
        const width = 570;
        const height = 600;

        const newWindow = await chrome.windows.create({
            url: chrome.runtime.getURL("notification.html"),
            type: "popup",
            width,
            height,
            focused: true,
            top: currentWindow.top + topOffset,
            left: currentWindow.left + currentWindow.width - width - rightOffset,
        });

        notificationWindowId = newWindow.id;
        const tabId = newWindow.tabs[0].id;

        chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, changeInfo) {
            if (tabId === tabIdUpdated && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                isNotificationLoaded = true;
                //console.log("Window content fully loaded");
            }
        });

        chrome.tabs.onRemoved.addListener(function listener(tabIdUpdated) {
            if (tabId === tabIdUpdated) {
                chrome.tabs.onRemoved.removeListener(listener);
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
