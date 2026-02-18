/* global browser */

let notificationWindowId = null;

/**
 * Returns a promise that resolves when the given tab finishes loading,
 * or rejects after `timeoutMs` milliseconds.
 *
 * @param {number} tabId - The tab ID to wait for.
 * @param {number} [timeoutMs=10000] - Timeout in milliseconds.
 * @returns {Promise<void>}
 */
function waitForTabLoad(tabId, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        let timeoutId;

        const onUpdated = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                cleanup();
                resolve();
            }
        };

        const cleanup = () => {
            browser.tabs.onUpdated.removeListener(onUpdated);
            clearTimeout(timeoutId);
        };

        browser.tabs.onUpdated.addListener(onUpdated);

        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Notification load timed out"));
        }, timeoutMs);
    });
}

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

        await waitForTabLoad(tabId);
    }
};

export default openNotificationAsync;
