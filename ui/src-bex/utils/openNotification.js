/*global chrome browser*/
/*eslint no-undef: "error"*/

export const openNotification = async () =>
    await new Promise((resolve) =>
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
                            resolve(newWindow);
                        }
                    });
                }
            );
        })
    );
