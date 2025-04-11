/*global chrome browser*/
/*eslint no-undef: "error"*/

let popupWindowId = null;
export let isNotificationLoaded = false;

export const openNotification = async () => {
    if (popupWindowId) {
        const views = await browser.runtime.getContexts({ windowIds: [popupWindowId] });
        if (views.length > 0) {
            await chrome.windows.update(popupWindowId, { focused: true });
        } else {
            popupWindowId = null;
        }
        console.log(views);
    }

    if (popupWindowId) {
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

    return await new Promise((resolve) =>
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
                    popupWindowId = newWindow.id;
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
};
