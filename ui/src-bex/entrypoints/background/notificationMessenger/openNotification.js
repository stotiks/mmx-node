/* global browser */

let notificationWindowId = null;

/**
 * In-flight promise guard — prevents concurrent calls from opening duplicate
 * notification windows. Cleared after the window finishes loading (or on error).
 */
let pendingOpen = null;

/**
 * Listen for window removal to clear stale notificationWindowId.
 * This prevents the code from thinking the window still exists after user closes it.
 */
browser.windows.onRemoved.addListener((windowId) => {
    if (windowId === notificationWindowId) {
        notificationWindowId = null;
    }
});

/**
 * Configuration for the notification window.
 */
const NOTIFICATION_CONFIG = {
    url: "popup.html",
    type: "popup",
    width: 570,
    height: 600,
    rightOffset: 80,
    topOffset: 80,
};

/**
 * Returns a promise that resolves when the notification window finishes loading,
 * or rejects after `timeoutMs` milliseconds.
 *
 * @param {number} windowId - The window ID to wait for.
 * @param {number} tabId - The tab ID within the window.
 * @param {number} [timeoutMs=30000] - Timeout in milliseconds.
 * @returns {Promise<void>}
 */
const waitForWindowLoad = (windowId, tabId, timeoutMs = 30000) => {
    return new Promise((resolve, reject) => {
        let timeoutId;

        const onUpdated = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                cleanup();
                resolve();
            }
        };

        const onRemoved = (removedWindowId) => {
            if (removedWindowId === windowId) {
                cleanup();
                reject(new Error("Notification window was closed"));
            }
        };

        const cleanup = () => {
            browser.tabs.onUpdated.removeListener(onUpdated);
            browser.windows.onRemoved.removeListener(onRemoved);
            clearTimeout(timeoutId);
        };

        browser.tabs.onUpdated.addListener(onUpdated);
        browser.windows.onRemoved.addListener(onRemoved);

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

    const urlStr = browser.runtime.getURL(NOTIFICATION_CONFIG.url);
    const url = new URL(urlStr);
    url.searchParams.set("notification", "true");

    const newWindow = await browser.windows.create({
        url: url.href,
        type: NOTIFICATION_CONFIG.type,
        width: NOTIFICATION_CONFIG.width,
        height: NOTIFICATION_CONFIG.height,
        focused: true,
        top: currentWindow.top + NOTIFICATION_CONFIG.topOffset,
        left: currentWindow.left + currentWindow.width - NOTIFICATION_CONFIG.width - NOTIFICATION_CONFIG.rightOffset,
    });

    notificationWindowId = newWindow.id;

    return {
        windowId: newWindow.id,
        tabId: newWindow.tabs[0].id,
    };
};

/**
 * Opens the notification window, creating it if necessary.
 * @returns {Promise<void>}
 */
const openNotificationAsync = async () => {
    // If a window is already being opened, join the in-flight promise instead
    if (pendingOpen) return pendingOpen;

    // Capture the window ID before checking existence to avoid race condition
    // where window closes between check and focus call
    const windowId = notificationWindowId;

    // Check if existing window is still open
    if (windowId && (await windowExists(windowId))) {
        await focusWindow(windowId);
        return;
    }

    // Create new notification window and wait for it to load.
    // Store the promise so concurrent callers share it.
    pendingOpen = (async () => {
        const { windowId, tabId } = await createNotificationWindow();
        await waitForWindowLoad(windowId, tabId);
    })().finally(() => {
        pendingOpen = null;
    });

    return pendingOpen;
};

export default openNotificationAsync;
