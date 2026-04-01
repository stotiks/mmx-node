import { browser } from "wxt/browser";

/**
 * Creates an idle timeout module that automatically locks the vault after a period of inactivity.
 * Uses the chrome.alarms API (MV3-compatible) for reliable background timing.
 *
 * @param {Object} config - Configuration object
 * @param {Function} config.lock - Function to call when the timeout expires
 * @param {number} [config.timeoutMinutes=15] - Idle timeout in minutes (default: 15)
 * @param {string} [config.alarmName='vault-idle-timeout'] - Name for the alarm
 * @returns {Object} Idle timeout module interface
 */
export const createIdleTimeoutModule = ({ lock, timeoutMinutes = 15, alarmName = "vault-idle-timeout" }) => {
    let isEnabled = false;

    /**
     * Starts or resets the idle timeout alarm.
     * If the alarm already exists, it will be cleared and recreated.
     */
    const resetTimeout = async () => {
        if (!isEnabled) {
            return;
        }

        // Clear any existing alarm
        await browser.alarms.clear(alarmName);

        // Create a new alarm that fires after the specified timeout
        await browser.alarms.create(alarmName, {
            delayInMinutes: timeoutMinutes,
        });
    };

    /**
     * Handles the alarm event and locks the vault if it's the idle timeout alarm.
     */
    const handleAlarm = (alarm) => {
        if (alarm.name === alarmName) {
            console.log("Idle timeout triggered");
            lock();
            stopTimeout();
        }
    };

    /**
     * Starts the idle timeout feature.
     * Enables the timeout and sets up the alarm listener.
     */
    const startTimeout = async () => {
        if (isEnabled) {
            return;
        }

        isEnabled = true;
        browser.alarms.onAlarm.addListener(handleAlarm);
        await resetTimeout();
    };

    /**
     * Stops the idle timeout feature.
     * Disables the timeout, removes the alarm listener, and clears any pending alarms.
     */
    const stopTimeout = async () => {
        if (!isEnabled) {
            return;
        }

        isEnabled = false;
        browser.alarms.onAlarm.removeListener(handleAlarm);
        await browser.alarms.clear(alarmName);
    };

    /**
     * Gets the current enabled state of the idle timeout.
     */
    const getIsEnabled = () => isEnabled;

    return {
        startTimeout,
        stopTimeout,
        resetTimeout,
        getIsEnabled,
    };
};
