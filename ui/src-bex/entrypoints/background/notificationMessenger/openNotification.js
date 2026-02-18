/* global browser */

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
 * Returns a promise that resolves when the given tab finishes loading,
 * or rejects after `timeoutMs` milliseconds.
 *
 * @param {number} tabId - The tab ID to wait for.
 * @param {number} [timeoutMs=30000] - Timeout in milliseconds.
 * @returns {Promise<void>}
 */
const waitForTabLoad = (tabId, timeoutMs = 30000) => {
    return new Promise((resolve, reject) => {
        let timeoutId;

        const onUpdated = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                cleanup();
                resolve();
            }
        };

        const onRemoved = (removedTabId) => {
            if (removedTabId === tabId) {
                cleanup();
                reject(new Error("Notification tab was closed"));
            }
        };

        const cleanup = () => {
            browser.tabs.onUpdated.removeListener(onUpdated);
            browser.tabs.onRemoved.removeListener(onRemoved);
            clearTimeout(timeoutId);
        };

        browser.tabs.onUpdated.addListener(onUpdated);
        browser.tabs.onRemoved.addListener(onRemoved);

        timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Notification load timed out"));
        }, timeoutMs);
    });
};

/**
 * Checks if a window with the given ID exists.
 * @param {number|null} windowId - The window ID to check.
 * @returns {Promise<boolean>} True if window exists, false otherwise.
 */
const windowExists = async (windowId) => {
    if (!windowId) {
        return false;
    }

    const views = await browser.runtime.getContexts({ windowIds: [windowId] });
    return views.length > 0;
};

/**
 * Focuses the window with the given ID.
 * @param {number} windowId - The window ID to focus.
 * @returns {Promise<void>}
 */
const focusWindow = async (windowId) => {
    await browser.windows.update(windowId, { focused: true });
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

let notificationWindowId = null;
const openNotificationAsync = async () => {
    // Check if existing window is still open
    if (await windowExists(notificationWindowId)) {
        await focusWindow(notificationWindowId);
        return;
    }

    // Create new notification window
    const { windowId, tabId } = await createNotificationWindow();
    notificationWindowId = windowId;

    // Wait for the window to load
    await waitForTabLoad(tabId);
};

export default openNotificationAsync;
