import { describe, it, expect, vi, beforeEach } from "vitest";
import { StorageItem } from "./StorageItem";

// Mock the @wxt-dev/storage module
vi.mock("@wxt-dev/storage", () => ({
    storage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    },
}));

import { storage } from "@wxt-dev/storage";

describe("StorageItem", () => {
    const TEST_KEY = "test-key";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("constructor", () => {
        it("creates instance with provided key", () => {
            const item = new StorageItem(TEST_KEY);

            expect(item).toBeInstanceOf(StorageItem);
            expect(item.key).toBe(TEST_KEY);
        });

        it("creates instances with different keys", () => {
            const item1 = new StorageItem("key1");
            const item2 = new StorageItem("key2");

            expect(item1.key).toBe("key1");
            expect(item2.key).toBe("key2");
        });
    });

    describe("key getter", () => {
        it("returns the key provided in constructor", () => {
            const item = new StorageItem(TEST_KEY);

            expect(item.key).toBe(TEST_KEY);
        });

        it("key is read-only (private field pattern)", () => {
            const item = new StorageItem(TEST_KEY);
            const originalKey = item.key;

            // Attempt to modify (should throw error or be ignored)
            expect(() => {
                item.key = "modified-key";
            }).toThrow();

            // The getter should still return the original key
            expect(item.key).toBe(originalKey);
        });
    });

    describe("existsAsync", () => {
        it("returns true when item exists in storage", async () => {
            storage.getItem.mockResolvedValue({ some: "data" });
            const item = new StorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(true);
            expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
        });

        it("returns false when item does not exist in storage", async () => {
            storage.getItem.mockResolvedValue(null);
            const item = new StorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(false);
            expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
        });

        it("returns true when item exists with falsy but non-null value", async () => {
            storage.getItem.mockResolvedValue(0);
            const item = new StorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(true);
        });

        it("returns true when item exists with empty object", async () => {
            storage.getItem.mockResolvedValue({});
            const item = new StorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(true);
        });

        it("returns true when item exists with empty string", async () => {
            storage.getItem.mockResolvedValue("");
            const item = new StorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(true);
        });
    });

    describe("getAsync", () => {
        it("retrieves data from storage", async () => {
            const testData = { foo: "bar", num: 42 };
            storage.getItem.mockResolvedValue(testData);
            const item = new StorageItem(TEST_KEY);

            const result = await item.getAsync();

            expect(result).toEqual(testData);
            expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
        });

        it("returns null when item does not exist", async () => {
            storage.getItem.mockResolvedValue(null);
            const item = new StorageItem(TEST_KEY);

            const result = await item.getAsync();

            expect(result).toBeNull();
            expect(storage.getItem).toHaveBeenCalledWith(TEST_KEY);
        });

        it("returns primitive values", async () => {
            storage.getItem.mockResolvedValue("string value");
            const item = new StorageItem(TEST_KEY);

            const result = await item.getAsync();

            expect(result).toBe("string value");
        });

        it("returns array values", async () => {
            const testArray = [1, 2, 3, 4, 5];
            storage.getItem.mockResolvedValue(testArray);
            const item = new StorageItem(TEST_KEY);

            const result = await item.getAsync();

            expect(result).toEqual(testArray);
        });

        it("calls storage.getItem with correct key", async () => {
            const customKey = "custom-storage-key";
            const item = new StorageItem(customKey);

            await item.getAsync();

            expect(storage.getItem).toHaveBeenCalledWith(customKey);
            expect(storage.getItem).toHaveBeenCalledTimes(1);
        });
    });

    describe("setAsync", () => {
        it("stores data in storage", async () => {
            const testData = { foo: "bar", num: 42 };
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            const result = await item.setAsync(testData);

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, testData);
            expect(result).toBeUndefined();
        });

        it("stores primitive values", async () => {
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            await item.setAsync("test string");

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, "test string");
        });

        it("stores null value", async () => {
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            await item.setAsync(null);

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, null);
        });

        it("stores undefined value", async () => {
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            await item.setAsync(undefined);

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, undefined);
        });

        it("stores array values", async () => {
            const testArray = [1, 2, 3];
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            await item.setAsync(testArray);

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, testArray);
        });

        it("stores complex nested objects", async () => {
            const complexData = {
                level1: {
                    level2: {
                        array: [1, 2, 3],
                        string: "test",
                    },
                },
            };
            storage.setItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            await item.setAsync(complexData);

            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, complexData);
        });

        it("returns the result from storage.setItem", async () => {
            const returnValue = { success: true };
            storage.setItem.mockResolvedValue(returnValue);
            const item = new StorageItem(TEST_KEY);

            const result = await item.setAsync({ data: "test" });

            expect(result).toEqual(returnValue);
        });

        it("calls storage.setItem with correct key", async () => {
            const customKey = "custom-set-key";
            const item = new StorageItem(customKey);

            await item.setAsync({ data: "value" });

            expect(storage.setItem).toHaveBeenCalledWith(customKey, { data: "value" });
            expect(storage.setItem).toHaveBeenCalledTimes(1);
        });
    });

    describe("removeAsync", () => {
        it("removes item from storage", async () => {
            storage.removeItem.mockResolvedValue(undefined);
            const item = new StorageItem(TEST_KEY);

            const result = await item.removeAsync();

            expect(storage.removeItem).toHaveBeenCalledWith(TEST_KEY);
            expect(result).toBeUndefined();
        });

        it("calls storage.removeItem with correct key", async () => {
            const customKey = "key-to-remove";
            storage.removeItem.mockResolvedValue(undefined);
            const item = new StorageItem(customKey);

            await item.removeAsync();

            expect(storage.removeItem).toHaveBeenCalledWith(customKey);
            expect(storage.removeItem).toHaveBeenCalledTimes(1);
        });

        it("returns the result from storage.removeItem", async () => {
            const returnValue = { removed: true };
            storage.removeItem.mockResolvedValue(returnValue);
            const item = new StorageItem(TEST_KEY);

            const result = await item.removeAsync();

            expect(result).toEqual(returnValue);
        });
    });

    describe("integration workflows", () => {
        it("handles complete lifecycle: set -> exists -> get -> remove", async () => {
            const testData = { value: "test data" };
            const item = new StorageItem(TEST_KEY);

            // Set data
            storage.setItem.mockResolvedValue(undefined);
            await item.setAsync(testData);
            expect(storage.setItem).toHaveBeenCalledWith(TEST_KEY, testData);

            // Check exists
            storage.getItem.mockResolvedValue(testData);
            const exists = await item.existsAsync();
            expect(exists).toBe(true);

            // Get data
            const retrieved = await item.getAsync();
            expect(retrieved).toEqual(testData);

            // Remove data
            storage.removeItem.mockResolvedValue(undefined);
            await item.removeAsync();
            expect(storage.removeItem).toHaveBeenCalledWith(TEST_KEY);

            // Verify doesn't exist after removal
            storage.getItem.mockResolvedValue(null);
            const existsAfterRemove = await item.existsAsync();
            expect(existsAfterRemove).toBe(false);
        });

        it("handles multiple operations on same key", async () => {
            const item = new StorageItem(TEST_KEY);

            // First set
            storage.setItem.mockResolvedValue(undefined);
            await item.setAsync({ count: 1 });

            // Second set (update)
            await item.setAsync({ count: 2 });

            // Get
            storage.getItem.mockResolvedValue({ count: 2 });
            const result = await item.getAsync();

            expect(result).toEqual({ count: 2 });
            expect(storage.setItem).toHaveBeenCalledTimes(2);
        });

        it("handles multiple StorageItem instances with different keys", async () => {
            const item1 = new StorageItem("key1");
            const item2 = new StorageItem("key2");

            storage.setItem.mockResolvedValue(undefined);
            await item1.setAsync({ id: 1 });
            await item2.setAsync({ id: 2 });

            expect(storage.setItem).toHaveBeenCalledWith("key1", { id: 1 });
            expect(storage.setItem).toHaveBeenCalledWith("key2", { id: 2 });
        });
    });

    describe("edge cases", () => {
        it("handles storage errors gracefully", async () => {
            const error = new Error("Storage error");
            storage.getItem.mockRejectedValue(error);
            const item = new StorageItem(TEST_KEY);

            await expect(item.getAsync()).rejects.toThrow("Storage error");
        });

        it("handles special characters in key", () => {
            const specialKey = "key-with-special_chars:123";
            const item = new StorageItem(specialKey);

            expect(item.key).toBe(specialKey);
        });

        it("handles empty string key", () => {
            const item = new StorageItem("");

            expect(item.key).toBe("");
        });

        it("handles numeric-like string keys", () => {
            const item = new StorageItem("12345");

            expect(item.key).toBe("12345");
        });
    });
});
