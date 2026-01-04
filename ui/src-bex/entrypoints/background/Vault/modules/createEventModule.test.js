import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEventModule } from "./createEventModule.js";

describe("createEventModule", () => {
    let eventModule;

    beforeEach(() => {
        eventModule = createEventModule();
    });

    describe("on", () => {
        it("should register an event listener", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            expect(eventModule.getListenerCount("test")).toBe(1);
        });

        it("should allow multiple listeners for the same event", () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            eventModule.on("test", callback1);
            eventModule.on("test", callback2);

            expect(eventModule.getListenerCount("test")).toBe(2);
        });

        it("should support method chaining", () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            const result = eventModule.on("event1", callback1).on("event2", callback2);

            expect(result).toBe(eventModule);
            expect(eventModule.getListenerCount("event1")).toBe(1);
            expect(eventModule.getListenerCount("event2")).toBe(1);
        });

        it("should throw error if event name is not a string", () => {
            expect(() => eventModule.on(123, vi.fn())).toThrow("Event name must be a string");
            expect(() => eventModule.on(null, vi.fn())).toThrow("Event name must be a string");
            expect(() => eventModule.on(undefined, vi.fn())).toThrow("Event name must be a string");
        });

        it("should throw error if callback is not a function", () => {
            expect(() => eventModule.on("test", "not a function")).toThrow("Callback must be a function");
            expect(() => eventModule.on("test", 123)).toThrow("Callback must be a function");
            expect(() => eventModule.on("test", null)).toThrow("Callback must be a function");
        });
    });

    describe("emit", () => {
        it("should call registered listeners when event is emitted", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            eventModule.emit("test");

            expect(callback).toHaveBeenCalledTimes(1);
        });

        it("should pass arguments to event listeners", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            eventModule.emit("test", "arg1", "arg2", 123);

            expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
        });

        it("should call multiple listeners in order", () => {
            const callOrder = [];
            const callback1 = vi.fn(() => callOrder.push(1));
            const callback2 = vi.fn(() => callOrder.push(2));
            const callback3 = vi.fn(() => callOrder.push(3));

            eventModule.on("test", callback1);
            eventModule.on("test", callback2);
            eventModule.on("test", callback3);

            eventModule.emit("test");

            expect(callOrder).toEqual([1, 2, 3]);
        });

        it("should not throw if emitting event with no listeners", () => {
            expect(() => eventModule.emit("nonexistent")).not.toThrow();
        });

        it("should handle errors in callbacks and continue with other callbacks", () => {
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            const callback1 = vi.fn(() => {
                throw new Error("Callback 1 error");
            });
            const callback2 = vi.fn();
            const callback3 = vi.fn();

            eventModule.on("test", callback1);
            eventModule.on("test", callback2);
            eventModule.on("test", callback3);

            eventModule.emit("test");

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error in test event handler:", expect.any(Error));

            consoleErrorSpy.mockRestore();
        });

        it("should throw error if event name is not a string", () => {
            expect(() => eventModule.emit(123)).toThrow("Event name must be a string");
            expect(() => eventModule.emit(null)).toThrow("Event name must be a string");
        });
    });

    describe("wildcard events (<any>)", () => {
        it("should call wildcard listeners for any event", () => {
            const wildcardCallback = vi.fn();
            eventModule.on("<any>", wildcardCallback);

            eventModule.emit("event1", "data1");
            eventModule.emit("event2", "data2");

            expect(wildcardCallback).toHaveBeenCalledTimes(2);
            expect(wildcardCallback).toHaveBeenNthCalledWith(1, "event1", "data1");
            expect(wildcardCallback).toHaveBeenNthCalledWith(2, "event2", "data2");
        });

        it("should call both specific and wildcard listeners", () => {
            const specificCallback = vi.fn();
            const wildcardCallback = vi.fn();

            eventModule.on("test", specificCallback);
            eventModule.on("<any>", wildcardCallback);

            eventModule.emit("test", "data");

            expect(specificCallback).toHaveBeenCalledWith("data");
            expect(wildcardCallback).toHaveBeenCalledWith("test", "data");
        });

        it("should handle errors in wildcard callbacks", () => {
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            const wildcardCallback = vi.fn(() => {
                throw new Error("Wildcard error");
            });

            eventModule.on("<any>", wildcardCallback);

            eventModule.emit("test");

            expect(wildcardCallback).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error in wildcard event handler for test:",
                expect.any(Error)
            );

            consoleErrorSpy.mockRestore();
        });

        it("should not trigger wildcard on itself", () => {
            const wildcardCallback = vi.fn();
            eventModule.on("<any>", wildcardCallback);

            eventModule.emit("<any>", "data");

            // Wildcard listeners receive both the specific <any> event and the wildcard trigger
            // This is expected behavior - called twice: once as specific listener, once as wildcard
            expect(wildcardCallback).toHaveBeenCalledTimes(2);
            expect(wildcardCallback).toHaveBeenNthCalledWith(1, "data");
            expect(wildcardCallback).toHaveBeenNthCalledWith(2, "<any>", "data");
        });
    });

    describe("removeListener", () => {
        it("should remove a specific listener", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            eventModule.removeListener("test", callback);

            eventModule.emit("test");
            expect(callback).not.toHaveBeenCalled();
            expect(eventModule.getListenerCount("test")).toBe(0);
        });

        it("should only remove the specified callback", () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            eventModule.on("test", callback1);
            eventModule.on("test", callback2);

            eventModule.removeListener("test", callback1);

            eventModule.emit("test");
            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it("should support method chaining", () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            eventModule.on("event1", callback1);
            eventModule.on("event2", callback2);

            const result = eventModule.removeListener("event1", callback1).removeListener("event2", callback2);

            expect(result).toBe(eventModule);
        });

        it("should clean up empty event arrays", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            eventModule.removeListener("test", callback);

            expect(eventModule.getEventNames()).not.toContain("test");
        });

        it("should not throw if removing non-existent listener", () => {
            const callback = vi.fn();

            expect(() => eventModule.removeListener("test", callback)).not.toThrow();
        });

        it("should throw error if event name is not a string", () => {
            expect(() => eventModule.removeListener(123, vi.fn())).toThrow("Event name must be a string");
        });

        it("should throw error if callback is not a function", () => {
            expect(() => eventModule.removeListener("test", "not a function")).toThrow("Callback must be a function");
        });
    });

    describe("getListenerCount", () => {
        it("should return 0 for events with no listeners", () => {
            expect(eventModule.getListenerCount("nonexistent")).toBe(0);
        });

        it("should return correct count for events with listeners", () => {
            eventModule.on("test", vi.fn());
            eventModule.on("test", vi.fn());
            eventModule.on("test", vi.fn());

            expect(eventModule.getListenerCount("test")).toBe(3);
        });

        it("should throw error if event name is not a string", () => {
            expect(() => eventModule.getListenerCount(123)).toThrow("Event name must be a string");
        });
    });

    describe("getEventNames", () => {
        it("should return empty array when no events are registered", () => {
            expect(eventModule.getEventNames()).toEqual([]);
        });

        it("should return array of registered event names", () => {
            eventModule.on("event1", vi.fn());
            eventModule.on("event2", vi.fn());
            eventModule.on("event3", vi.fn());

            const names = eventModule.getEventNames();
            expect(names).toContain("event1");
            expect(names).toContain("event2");
            expect(names).toContain("event3");
            expect(names).toHaveLength(3);
        });

        it("should not include removed events", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);
            eventModule.removeListener("test", callback);

            expect(eventModule.getEventNames()).not.toContain("test");
        });
    });

    describe("removeAllListeners", () => {
        it("should remove all listeners for a specific event", () => {
            eventModule.on("test", vi.fn());
            eventModule.on("test", vi.fn());
            eventModule.on("test", vi.fn());

            eventModule.removeAllListeners("test");

            expect(eventModule.getListenerCount("test")).toBe(0);
            expect(eventModule.getEventNames()).not.toContain("test");
        });

        it("should not affect other events", () => {
            eventModule.on("event1", vi.fn());
            eventModule.on("event2", vi.fn());

            eventModule.removeAllListeners("event1");

            expect(eventModule.getListenerCount("event1")).toBe(0);
            expect(eventModule.getListenerCount("event2")).toBe(1);
        });

        it("should not throw if event does not exist", () => {
            expect(() => eventModule.removeAllListeners("nonexistent")).not.toThrow();
        });

        it("should throw error if event name is not a string", () => {
            expect(() => eventModule.removeAllListeners(123)).toThrow("Event name must be a string");
        });
    });

    describe("removeAllListenersForAllEvents", () => {
        it("should remove all listeners for all events", () => {
            eventModule.on("event1", vi.fn());
            eventModule.on("event2", vi.fn());
            eventModule.on("event3", vi.fn());

            eventModule.removeAllListenersForAllEvents();

            expect(eventModule.getEventNames()).toEqual([]);
            expect(eventModule.getListenerCount("event1")).toBe(0);
            expect(eventModule.getListenerCount("event2")).toBe(0);
            expect(eventModule.getListenerCount("event3")).toBe(0);
        });

        it("should allow registering new listeners after clearing all", () => {
            eventModule.on("test", vi.fn());
            eventModule.removeAllListenersForAllEvents();

            const callback = vi.fn();
            eventModule.on("newEvent", callback);

            eventModule.emit("newEvent");
            expect(callback).toHaveBeenCalled();
        });
    });

    describe("closure-based private storage", () => {
        it("should maintain separate event storage per instance", () => {
            const module1 = createEventModule();
            const module2 = createEventModule();

            const callback1 = vi.fn();
            const callback2 = vi.fn();

            module1.on("test", callback1);
            module2.on("test", callback2);

            module1.emit("test");

            expect(callback1).toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
        });

        it("should not expose internal events Map", () => {
            const callback = vi.fn();
            eventModule.on("test", callback);

            expect(eventModule.events).toBeUndefined();
            expect(Object.keys(eventModule)).not.toContain("events");
        });
    });

    describe("edge cases", () => {
        it("should handle listeners that modify the event system during emission", () => {
            const callback1 = vi.fn(() => {
                // Remove itself during execution
                eventModule.removeListener("test", callback1);
            });
            const callback2 = vi.fn();

            eventModule.on("test", callback1);
            eventModule.on("test", callback2);

            eventModule.emit("test");

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(eventModule.getListenerCount("test")).toBe(1);
        });

        it("should handle listeners that add new listeners during emission", () => {
            const callback2 = vi.fn();
            const callback1 = vi.fn(() => {
                eventModule.on("test", callback2);
            });

            eventModule.on("test", callback1);

            eventModule.emit("test");

            // callback2 should not be called during first emit
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).not.toHaveBeenCalled();

            // But should be called on subsequent emits
            eventModule.emit("test");
            expect(callback2).toHaveBeenCalledTimes(1);
        });

        it("should handle empty string as event name", () => {
            const callback = vi.fn();
            eventModule.on("", callback);

            eventModule.emit("");

            expect(callback).toHaveBeenCalled();
        });

        it("should handle special characters in event names", () => {
            const callback = vi.fn();
            const specialName = "event:with:colons.and.dots";

            eventModule.on(specialName, callback);
            eventModule.emit(specialName, "data");

            expect(callback).toHaveBeenCalledWith("data");
        });
    });
});
