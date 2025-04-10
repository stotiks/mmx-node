/*global chrome browser*/
/*eslint no-undef: "error"*/

export const openPopup = () =>
    chrome.windows.getCurrent((currentWindow) => {
        const rightOffset = 80;
        const topOffset = 80;

        const width = 400;
        const height = 600;

        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width,
            height,
            focused: true,
            top: currentWindow.top + topOffset,
            left: currentWindow.left + currentWindow.width - width - rightOffset,
        });
    });
