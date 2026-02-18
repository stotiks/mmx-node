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
const waitForTabLoad = (tabId, timeoutMs = 10000) => {
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
};

/**
 * Configuration for the notification window.
 */
const NOTIFICATION_CONFIG = {
    url: "notification.html",
    type: "popup",
    width: 570,
    height: 600,
    rightOffset: 80,
    topOffset: 80,
};

/**
 * Checks if the notification window is still open and focuses it if so.
 * @param {number|null} windowId - The window ID to check.
 * @returns {Promise<boolean>} True if window exists and was focused, false otherwise.
 */
const focusExistingWindow = async (windowId) => {
    if (!windowId) {
        return false;
    }

    const views = await browser.runtime.getContexts({ windowIds: [windowId] });
    if (views.length > 0) {
        await browser.windows.update(windowId, { focused: true });
        return true;
    }

    return false;
};

/**
 * Creates a new notification window positioned relative to the current window.
 * @returns {Promise<{windowId: number, tabId: number}>}
 */
const createNotificationWindow = async () => {
    const currentWindow = await browser.windows.getCurrent();

    const newWindow = await browser.windows.create({
        url: browser.runtime.getURL(NOTIFICATION_CONFIG.url),
        type: NOTIFICATION_CONFIG.type,
        width: NOTIFICATION_CONFIG.width,
        height: NOTIFICATION_CONFIG.height,
        focused: true,
        top: currentWindow.top + NOTIFICATION_CONFIG.topOffset,
        left: currentWindow.left + currentWindow.width - NOTIFICATION_CONFIG.width - NOTIFICATION_CONFIG.rightOffset,
    });

    return {
        windowId: newWindow.id,
        tabId: newWindow.tabs[0].id,
    };
};

/**
 * Sets up a listener to clean up when the notification window is closed.
 * @param {number} tabId - The tab ID to monitor.
 */
const setupWindowCloseListener = (tabId) => {
    const onRemoved = (removedTabId) => {
        if (tabId === removedTabId) {
            browser.tabs.onRemoved.removeListener(onRemoved);
            notificationWindowId = null;
        }
    };

    browser.tabs.onRemoved.addListener(onRemoved);
};

const openNotificationAsync = async () => {
    // Try to focus existing window
    if (await focusExistingWindow(notificationWindowId)) {
        return;
    }

    // Clear stale window ID if window no longer exists
    notificationWindowId = null;

    // Create new notification window
    const { windowId, tabId } = await createNotificationWindow();
    notificationWindowId = windowId;

    // Setup cleanup listener
    setupWindowCloseListener(tabId);

    // Wait for the window to load
    await waitForTabLoad(tabId);
};

export default openNotificationAsync;
