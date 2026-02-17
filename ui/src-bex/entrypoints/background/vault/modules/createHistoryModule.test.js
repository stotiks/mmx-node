import { describe, it, expect } from "vitest";
import { createHistoryModule } from "./createHistoryModule";

describe("createHistoryModule", () => {
    const createDeps = (overrides = {}) => {
        const store = { entries: [] };

        const historyBoundStorage = {
            getAsync: async () => store,
            setAsync: async (next) => {
                store.entries = next.entries;
            },
        };

        const events = [];
        const eventModule = {
            emit: (name, payload) => {
                events.push({ name, payload });
            },
        };

        const requireUnlocked = () => {}; // Mock requireUnlocked function

        return {
            store,
            events,
            historyBoundStorage,
            eventModule,
            requireUnlocked,
            ...overrides,
        };
    };

    it("adds a valid entry with id and timestamp", async () => {
        const deps = createDeps({
            now: () => 123,
            randomId: () => "id-1",
        });

        const module = createHistoryModule({
            historyBoundStorage: deps.historyBoundStorage,
            eventModule: deps.eventModule,
            maxHistoryEntries: 10,
            requireUnlocked: deps.requireUnlocked,
            now: deps.now,
            randomId: deps.randomId,
        });

        await module.addHistoryAsync({
            wallet: "mmx1...",
            message: { data: { method: "send" } },
            result: { success: true },
        });

        const history = await module.getHistoryAsync();
        expect(history).toHaveLength(1);
        expect(history[0]).toMatchObject({
            id: "id-1",
            timestamp: 123,
            wallet: "mmx1...",
            message: { data: { method: "send" } },
            result: { success: true },
        });

        expect(deps.events.map((e) => e.name)).toContain("history-updated");
    });

    it("sorts newest first", async () => {
        const deps = createDeps({
            randomId: (() => {
                let i = 0;
                return () => `id-${++i}`;
            })(),
        });

        const module = createHistoryModule({
            historyBoundStorage: deps.historyBoundStorage,
            eventModule: deps.eventModule,
            maxHistoryEntries: 10,
            requireUnlocked: deps.requireUnlocked,
            now: (() => {
                const times = [100, 300, 200];
                let i = 0;
                return () => times[i++];
            })(),
            randomId: deps.randomId,
        });

        await module.addHistoryAsync({ message: { data: { method: "m1" } } });
        await module.addHistoryAsync({ message: { data: { method: "m2" } } });
        await module.addHistoryAsync({ message: { data: { method: "m3" } } });

        const history = await module.getHistoryAsync();
        expect(history.map((h) => h.timestamp)).toEqual([300, 200, 100]);
    });

    it("enforces maxHistoryEntries by trimming oldest", async () => {
        const deps = createDeps({
            randomId: (() => {
                let i = 0;
                return () => `id-${++i}`;
            })(),
        });

        const module = createHistoryModule({
            historyBoundStorage: deps.historyBoundStorage,
            eventModule: deps.eventModule,
            maxHistoryEntries: 2,
            requireUnlocked: deps.requireUnlocked,
            now: (() => {
                const times = [1, 2, 3];
                let i = 0;
                return () => times[i++];
            })(),
            randomId: deps.randomId,
        });

        await module.addHistoryAsync({ message: { data: { method: "a" } } });
        await module.addHistoryAsync({ message: { data: { method: "b" } } });
        await module.addHistoryAsync({ message: { data: { method: "c" } } });

        const history = await module.getHistoryAsync();
        expect(history).toHaveLength(2);
        expect(history.map((h) => h.message.data.method)).toEqual(["c", "b"]);
    });

    it("maxHistoryEntries=0 discards entries", async () => {
        const deps = createDeps({
            now: () => 1,
            randomId: () => "id-1",
        });

        const module = createHistoryModule({
            historyBoundStorage: deps.historyBoundStorage,
            eventModule: deps.eventModule,
            maxHistoryEntries: 0,
            requireUnlocked: deps.requireUnlocked,
            now: deps.now,
            randomId: deps.randomId,
        });

        await module.addHistoryAsync({ message: { data: { method: "a" } } });
        expect(await module.getHistoryCountAsync()).toBe(0);
    });

    it("clearHistoryAsync clears entries and emits event", async () => {
        const deps = createDeps({
            now: () => 1,
            randomId: () => "id-1",
        });

        const module = createHistoryModule({
            historyBoundStorage: deps.historyBoundStorage,
            eventModule: deps.eventModule,
            maxHistoryEntries: 10,
            requireUnlocked: deps.requireUnlocked,
            now: deps.now,
            randomId: deps.randomId,
        });

        await module.addHistoryAsync({ message: { data: { method: "a" } } });
        expect(await module.getHistoryCountAsync()).toBe(1);

        await module.clearHistoryAsync();
        expect(await module.getHistoryCountAsync()).toBe(0);
        expect(deps.events.some((e) => e.name === "history-cleared")).toBe(true);
    });
});
