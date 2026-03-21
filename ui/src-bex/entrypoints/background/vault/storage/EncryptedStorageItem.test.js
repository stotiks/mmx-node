import { describe, it, expect, vi, beforeEach } from "vitest";
import { EncryptedStorageItem } from "./EncryptedStorageItem";
import { base64 } from "@scure/base";

// Mock dependencies
vi.mock("@metamask/browser-passworder", () => ({
    encrypt: vi.fn(),
    decrypt: vi.fn(),
}));

vi.mock("@mmx/wallet/utils/JSONbigNative", () => ({
    JSONbigNativeString: {
        parse: vi.fn((str) => JSON.parse(str)),
        stringify: vi.fn((obj) => JSON.stringify(obj)),
    },
}));

vi.mock("./StorageItem", () => ({
    StorageItem: class MockStorageItem {
        constructor(key) {
            this._key = key;
        }
        get key() {
            return this._key;
        }
        async getAsync() {
            return this._mockGetAsync?.();
        }
        async setAsync(data) {
            return this._mockSetAsync?.(data);
        }
        async existsAsync() {
            return this._mockExistsAsync?.();
        }
        async removeAsync() {
            return this._mockRemoveAsync?.();
        }
    },
}));

import { encrypt, decrypt } from "@metamask/browser-passworder";
import { JSONbigNativeString } from "@mmx/wallet/utils/JSONbigNative";
import { StorageItem } from "./StorageItem";

describe("EncryptedStorageItem", () => {
    const TEST_KEY = "encrypted-test-key";
    const TEST_PASSWORD = "test-password";
    const TEST_DATA = { foo: "bar", num: 42 };
    const ENCRYPTED_DATA = "encrypted-data-string";

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock implementations
        StorageItem.prototype._mockGetAsync = undefined;
        StorageItem.prototype._mockSetAsync = undefined;
        StorageItem.prototype._mockExistsAsync = undefined;
        StorageItem.prototype._mockRemoveAsync = undefined;
    });

    describe("constructor", () => {
        it("creates instance and extends StorageItem", () => {
            const item = new EncryptedStorageItem(TEST_KEY);

            expect(item).toBeInstanceOf(EncryptedStorageItem);
            expect(item).toBeInstanceOf(StorageItem);
            expect(item.key).toBe(TEST_KEY);
        });
    });

    describe("getAsync", () => {
        describe("with string password", () => {
            it("decrypts and returns data with string password", async () => {
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(TEST_DATA);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.getAsync(TEST_PASSWORD);

                expect(decrypt).toHaveBeenCalledWith(TEST_PASSWORD, ENCRYPTED_DATA);
                expect(result).toEqual(TEST_DATA);
            });

            it("returns null when no data exists in storage", async () => {
                StorageItem.prototype._mockGetAsync = vi.fn(async () => null);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.getAsync(TEST_PASSWORD);

                expect(result).toBeNull();
                expect(decrypt).not.toHaveBeenCalled();
            });

            it("returns null when undefined data exists in storage", async () => {
                StorageItem.prototype._mockGetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.getAsync(TEST_PASSWORD);

                expect(result).toBeNull();
                expect(decrypt).not.toHaveBeenCalled();
            });
        });

        describe("with Uint8Array password", () => {
            it("decrypts data with Uint8Array password", async () => {
                const passwordBytes = new Uint8Array([1, 2, 3, 4, 5]);
                const base64Password = base64.encode(passwordBytes);
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(TEST_DATA);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.getAsync(passwordBytes);

                expect(decrypt).toHaveBeenCalledWith(base64Password, ENCRYPTED_DATA);
                expect(result).toEqual(TEST_DATA);
            });

            it("converts Uint8Array password to base64 before decryption", async () => {
                const passwordBytes = new Uint8Array([10, 20, 30, 40, 50]);
                const expectedBase64 = base64.encode(passwordBytes);
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(TEST_DATA);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.getAsync(passwordBytes);

                expect(decrypt).toHaveBeenCalledWith(expectedBase64, ENCRYPTED_DATA);
            });
        });

        describe("password validation", () => {
            it("throws error when password is not string or Uint8Array", async () => {
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.getAsync(123)).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.getAsync(null)).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.getAsync(undefined)).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.getAsync({})).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.getAsync([])).rejects.toThrow("Password must be a string or Uint8Array");
            });

            it("accepts empty string as valid password", async () => {
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(TEST_DATA);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.getAsync("")).resolves.not.toThrow();
                expect(decrypt).toHaveBeenCalledWith("", ENCRYPTED_DATA);
            });

            it("accepts empty Uint8Array as valid password", async () => {
                const emptyBytes = new Uint8Array([]);
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(TEST_DATA);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.getAsync(emptyBytes)).resolves.not.toThrow();
            });
        });

        describe("decryption edge cases", () => {
            it("handles decryption failure", async () => {
                const error = new Error("Decryption failed");
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockRejectedValue(error);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.getAsync(TEST_PASSWORD)).rejects.toThrow("Decryption failed");
            });

            it("handles complex decrypted data structures", async () => {
                const complexData = {
                    nested: {
                        array: [1, 2, 3],
                        object: { key: "value" },
                    },
                };
                StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
                decrypt.mockResolvedValue(complexData);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.getAsync(TEST_PASSWORD);

                expect(result).toEqual(complexData);
            });
        });
    });

    describe("setAsync", () => {
        describe("with string password", () => {
            it("encrypts and stores data with string password", async () => {
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async (data) => data);
                const item = new EncryptedStorageItem(TEST_KEY);

                const result = await item.setAsync(TEST_DATA, TEST_PASSWORD);

                expect(JSONbigNativeString.stringify).toHaveBeenCalledWith(TEST_DATA);
                expect(JSONbigNativeString.parse).toHaveBeenCalled();
                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, TEST_DATA);
                expect(StorageItem.prototype._mockSetAsync).toHaveBeenCalledWith(ENCRYPTED_DATA);
                expect(result).toBe(ENCRYPTED_DATA);
            });

            it("normalizes data through JSONbigNative parse/stringify cycle", async () => {
                const inputData = { bigNum: 123n, regular: 456 };
                const stringified = '{"bigNum":"123","regular":456}';
                const parsed = { bigNum: "123", regular: 456 };

                JSONbigNativeString.stringify.mockReturnValue(stringified);
                JSONbigNativeString.parse.mockReturnValue(parsed);
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(inputData, TEST_PASSWORD);

                expect(JSONbigNativeString.stringify).toHaveBeenCalledWith(inputData);
                expect(JSONbigNativeString.parse).toHaveBeenCalledWith(stringified);
                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, parsed);
            });
        });

        describe("with Uint8Array password", () => {
            it("encrypts data with Uint8Array password", async () => {
                const passwordBytes = new Uint8Array([5, 4, 3, 2, 1]);
                const base64Password = base64.encode(passwordBytes);
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(TEST_DATA, passwordBytes);

                expect(encrypt).toHaveBeenCalledWith(base64Password, TEST_DATA);
            });

            it("converts Uint8Array password to base64 before encryption", async () => {
                const passwordBytes = new Uint8Array([100, 200, 50]);
                const expectedBase64 = base64.encode(passwordBytes);
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(TEST_DATA, passwordBytes);

                expect(encrypt).toHaveBeenCalledWith(expectedBase64, TEST_DATA);
            });
        });

        describe("password validation", () => {
            it("throws error when password is not string or Uint8Array", async () => {
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.setAsync(TEST_DATA, 123)).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.setAsync(TEST_DATA, null)).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.setAsync(TEST_DATA, undefined)).rejects.toThrow(
                    "Password must be a string or Uint8Array"
                );
                await expect(item.setAsync(TEST_DATA, {})).rejects.toThrow("Password must be a string or Uint8Array");
                await expect(item.setAsync(TEST_DATA, [])).rejects.toThrow("Password must be a string or Uint8Array");
            });

            it("accepts empty string as valid password", async () => {
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.setAsync(TEST_DATA, "")).resolves.not.toThrow();
                expect(encrypt).toHaveBeenCalledWith("", TEST_DATA);
            });

            it("accepts empty Uint8Array as valid password", async () => {
                const emptyBytes = new Uint8Array([]);
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.setAsync(TEST_DATA, emptyBytes)).resolves.not.toThrow();
            });
        });

        describe("encryption edge cases", () => {
            it("handles encryption failure", async () => {
                const error = new Error("Encryption failed");
                JSONbigNativeString.parse.mockReturnValue(TEST_DATA);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(TEST_DATA));
                encrypt.mockRejectedValue(error);
                const item = new EncryptedStorageItem(TEST_KEY);

                await expect(item.setAsync(TEST_DATA, TEST_PASSWORD)).rejects.toThrow("Encryption failed");
            });

            it("encrypts null data", async () => {
                JSONbigNativeString.parse.mockReturnValue(null);
                JSONbigNativeString.stringify.mockReturnValue("null");
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(null, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, null);
            });

            it("encrypts undefined data", async () => {
                JSONbigNativeString.parse.mockReturnValue(undefined);
                JSONbigNativeString.stringify.mockReturnValue(undefined);
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(undefined, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalled();
            });

            it("encrypts complex nested data structures", async () => {
                const complexData = {
                    level1: {
                        level2: {
                            array: [1, 2, 3],
                            nested: { deep: "value" },
                        },
                    },
                };
                JSONbigNativeString.parse.mockReturnValue(complexData);
                JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(complexData));
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(complexData, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, complexData);
            });
        });

        describe("data handling", () => {
            it("stores primitive values", async () => {
                JSONbigNativeString.parse.mockReturnValue(123);
                JSONbigNativeString.stringify.mockReturnValue("123");
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(123, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, 123);
            });

            it("stores string values", async () => {
                const stringValue = "test string";
                JSONbigNativeString.parse.mockReturnValue(stringValue);
                JSONbigNativeString.stringify.mockReturnValue('"test string"');
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(stringValue, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, stringValue);
            });

            it("stores array values", async () => {
                const arrayValue = [1, 2, 3, 4, 5];
                JSONbigNativeString.parse.mockReturnValue(arrayValue);
                JSONbigNativeString.stringify.mockReturnValue("[1,2,3,4,5]");
                encrypt.mockResolvedValue(ENCRYPTED_DATA);
                StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
                const item = new EncryptedStorageItem(TEST_KEY);

                await item.setAsync(arrayValue, TEST_PASSWORD);

                expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, arrayValue);
            });
        });
    });

    describe("integration workflows", () => {
        it("handles complete encryption/decryption cycle", async () => {
            const originalData = { secret: "data", count: 42 };
            JSONbigNativeString.parse.mockReturnValue(originalData);
            JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(originalData));
            encrypt.mockResolvedValue(ENCRYPTED_DATA);
            decrypt.mockResolvedValue(originalData);
            StorageItem.prototype._mockSetAsync = vi.fn(async (data) => data);
            StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
            const item = new EncryptedStorageItem(TEST_KEY);

            // Store encrypted data
            await item.setAsync(originalData, TEST_PASSWORD);
            expect(encrypt).toHaveBeenCalledWith(TEST_PASSWORD, originalData);

            // Retrieve and decrypt data
            const retrieved = await item.getAsync(TEST_PASSWORD);
            expect(decrypt).toHaveBeenCalledWith(TEST_PASSWORD, ENCRYPTED_DATA);
            expect(retrieved).toEqual(originalData);
        });

        it("handles different passwords for encryption and decryption attempts", async () => {
            const originalData = { secret: "data" };
            const password1 = "password1";
            const password2 = "password2";
            JSONbigNativeString.parse.mockReturnValue(originalData);
            JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(originalData));
            encrypt.mockResolvedValue(ENCRYPTED_DATA);
            decrypt.mockRejectedValue(new Error("Invalid password"));
            StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
            StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
            const item = new EncryptedStorageItem(TEST_KEY);

            // Encrypt with password1
            await item.setAsync(originalData, password1);

            // Try to decrypt with password2 (should fail)
            await expect(item.getAsync(password2)).rejects.toThrow("Invalid password");
        });

        it("handles multiple set operations", async () => {
            const data1 = { version: 1 };
            const data2 = { version: 2 };
            JSONbigNativeString.parse.mockImplementation((str) => JSON.parse(str));
            JSONbigNativeString.stringify.mockImplementation((obj) => JSON.stringify(obj));
            encrypt.mockResolvedValue(ENCRYPTED_DATA);
            StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
            const item = new EncryptedStorageItem(TEST_KEY);

            await item.setAsync(data1, TEST_PASSWORD);
            await item.setAsync(data2, TEST_PASSWORD);

            expect(encrypt).toHaveBeenCalledTimes(2);
            expect(encrypt).toHaveBeenNthCalledWith(1, TEST_PASSWORD, data1);
            expect(encrypt).toHaveBeenNthCalledWith(2, TEST_PASSWORD, data2);
        });

        it("uses Uint8Array password consistently across operations", async () => {
            const passwordBytes = new Uint8Array([10, 20, 30]);
            const base64Password = base64.encode(passwordBytes);
            const data = { test: "data" };
            JSONbigNativeString.parse.mockReturnValue(data);
            JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(data));
            encrypt.mockResolvedValue(ENCRYPTED_DATA);
            decrypt.mockResolvedValue(data);
            StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
            StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
            const item = new EncryptedStorageItem(TEST_KEY);

            await item.setAsync(data, passwordBytes);
            const retrieved = await item.getAsync(passwordBytes);

            expect(encrypt).toHaveBeenCalledWith(base64Password, data);
            expect(decrypt).toHaveBeenCalledWith(base64Password, ENCRYPTED_DATA);
            expect(retrieved).toEqual(data);
        });
    });

    describe("inheritance from StorageItem", () => {
        it("inherits existsAsync method", async () => {
            StorageItem.prototype._mockExistsAsync = vi.fn(async () => true);
            const item = new EncryptedStorageItem(TEST_KEY);

            const exists = await item.existsAsync();

            expect(exists).toBe(true);
            expect(StorageItem.prototype._mockExistsAsync).toHaveBeenCalled();
        });

        it("inherits removeAsync method", async () => {
            StorageItem.prototype._mockRemoveAsync = vi.fn(async () => undefined);
            const item = new EncryptedStorageItem(TEST_KEY);

            await item.removeAsync();

            expect(StorageItem.prototype._mockRemoveAsync).toHaveBeenCalled();
        });

        it("inherits key getter", () => {
            const customKey = "my-encrypted-key";
            const item = new EncryptedStorageItem(customKey);

            expect(item.key).toBe(customKey);
        });
    });

    describe("edge cases", () => {
        it("handles JSONbigNative parse/stringify errors", async () => {
            const error = new Error("JSON parsing error");
            JSONbigNativeString.stringify.mockImplementation(() => {
                throw error;
            });
            const item = new EncryptedStorageItem(TEST_KEY);

            await expect(item.setAsync(TEST_DATA, TEST_PASSWORD)).rejects.toThrow("JSON parsing error");
        });

        it("handles special characters in data", async () => {
            const specialData = { text: "Special chars: 你好 émojis: 🔐🔑" };
            JSONbigNativeString.parse.mockReturnValue(specialData);
            JSONbigNativeString.stringify.mockReturnValue(JSON.stringify(specialData));
            encrypt.mockResolvedValue(ENCRYPTED_DATA);
            StorageItem.prototype._mockSetAsync = vi.fn(async () => undefined);
            const item = new EncryptedStorageItem(TEST_KEY);

            await expect(item.setAsync(specialData, TEST_PASSWORD)).resolves.not.toThrow();
        });

        it("handles very long passwords", async () => {
            const longPassword = "a".repeat(10000);
            StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
            decrypt.mockResolvedValue(TEST_DATA);
            const item = new EncryptedStorageItem(TEST_KEY);

            await expect(item.getAsync(longPassword)).resolves.not.toThrow();
            expect(decrypt).toHaveBeenCalledWith(longPassword, ENCRYPTED_DATA);
        });

        it("handles large Uint8Array passwords", async () => {
            const largePasswordBytes = new Uint8Array(1000).fill(255);
            StorageItem.prototype._mockGetAsync = vi.fn(async () => ENCRYPTED_DATA);
            decrypt.mockResolvedValue(TEST_DATA);
            const item = new EncryptedStorageItem(TEST_KEY);

            await expect(item.getAsync(largePasswordBytes)).resolves.not.toThrow();
        });
    });
});
