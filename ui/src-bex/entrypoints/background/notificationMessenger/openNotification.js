/* global browser */

let notificationWindowId = null;

const openNotificationAsync = async () => {
    if (notificationWindowId) {
        const views = await browser.runtime.getContexts({ windowIds: [notificationWindowId] });
        if (views.length > 0) {
            // focus the window
            await browser.windows.update(notificationWindowId, { focused: true });
            return;
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

        browser.tabs.onRemoved.addListener(function listener(tabIdUpdated) {
            if (tabId === tabIdUpdated) {
                browser.tabs.onRemoved.removeListener(listener);
                notificationWindowId = null;
                //console.log("Window closed");
            }
        });

        const loadingPromise = new Promise((resolve, reject) => {
            const listener = (tabIdUpdated, changeInfo) => {
                if (tabId === tabIdUpdated && changeInfo.status === "complete") {
                    browser.tabs.onUpdated.removeListener(listener);
                    clearTimeout(rejectTimeout);
                    //console.log("Notification loaded");
                    resolve();
                }
            };

            // wait for the tab to load
            browser.tabs.onUpdated.addListener(listener);

            const rejectTimeout = setTimeout(() => {
                browser.tabs.onUpdated.removeListener(listener);
                clearTimeout(rejectTimeout);
                reject("Notification load timed out");
            }, 10 * 1000);
        });

        await loadingPromise;
    }
};

export default openNotificationAsync;
