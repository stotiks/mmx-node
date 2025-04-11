/*global chrome browser*/
/*eslint no-undef: "error"*/

let windowId = null;
let isNotificationOpen = false;
export let isNotificationLoaded = false;

export const openNotification = async () => {
    if (windowId) {
        const views = await browser.runtime.getContexts({ windowIds: [windowId] });
        console.log(views);
    } else {
        windowId = null;
    }

    if (isNotificationOpen && windowId) {
        console.log("Notification is already open.");
        return new Promise((resolve) => {
            const checkPopupLoaded = setInterval(() => {
                if (isNotificationLoaded) {
                    clearInterval(checkPopupLoaded);
                    resolve();
                }
            }, 100);
        });
    }

    isNotificationOpen = true;

    const newWindow = await new Promise((resolve) =>
        chrome.windows.getCurrent((currentWindow) => {
            const rightOffset = 80;
            const topOffset = 80;

            const width = 400;
            const height = 600;

            chrome.windows.create(
                {
                    url: chrome.runtime.getURL("notification.html"),
                    type: "popup",
                    width,
                    height,
                    focused: true,
                    top: currentWindow.top + topOffset,
                    left: currentWindow.left + currentWindow.width - width - rightOffset,
                },
                function (newWindow) {
                    const tabId = newWindow.tabs[0].id;

                    chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, changeInfo) {
                        if (tabId === tabIdUpdated && changeInfo.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(listener);
                            console.log("Window content fully loaded");
                            isNotificationLoaded = true;
                            chrome.tabs.onRemoved.addListener(function listener2(tabIdUpdated) {
                                if (tabId === tabIdUpdated) {
                                    chrome.tabs.onRemoved.removeListener(listener2);
                                    console.log("Window closed");
                                    isNotificationOpen = false;
                                    isNotificationLoaded = false;
                                }
                            });

                            resolve(newWindow);
                        }
                    });
                }
            );
        })
    );

    windowId = newWindow.id;
    return newWindow;
};
