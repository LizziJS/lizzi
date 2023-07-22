import { zzSync } from "./sync";

describe("zzSync", () => {
  it("should create", () => {
    expect(zzSync).toBeInstanceOf(Function);
    const sync = new zzSync();

    expect(sync).toBeInstanceOf(zzSync);
  });

  describe("zzSync sync object", () => {
    const testObject1: { [key: string]: any } = { objecta: "a" };
    const testObject2: { [key: string]: any } = { objectb: "b" };

    const sync = new zzSync();

    sync.sync(testObject1, "id-1");
    sync.sync(testObject2, "id-2");

    expect(sync.size).toBe(2);

    it("should serialize numbers", () => {
      expect(sync.serialize(1)).toBe(1);
      expect(sync.unserialize(1)).toEqual(1);
    });

    it("should serialize strings", () => {
      expect(sync.serialize("string")).toBe("string");
      expect(sync.unserialize("string")).toEqual("string");
    });

    it("should serialize objects", () => {
      expect(sync.serialize(testObject1)).toEqual({ ___: "id-1" });
      expect(sync.serialize(testObject2)).toEqual({ ___: "id-2" });
      expect(sync.unserialize({ ___: "id-1" })).toBe(testObject1);
      expect(sync.unserialize({ ___: "id-2" })).toBe(testObject2);
    });

    it("should not unserialize not exists objects", () => {
      expect(sync.unserialize({ ___: "id-3" })).toBe(null);
    });

    it("should serialize objects with items", () => {
      expect(
        sync.serialize({
          id1: testObject1,
          id2: testObject2,
          id3: 1,
        })
      ).toEqual({ id1: { ___: "id-1" }, id2: { ___: "id-2" }, id3: 1 });
      expect(
        sync.unserialize({ id1: { ___: "id-1" }, id2: { ___: "id-2" }, id3: 2 })
      ).toEqual({
        id1: testObject1,
        id2: testObject2,
        id3: 2,
      });
    });

    it("should serialize arrays with items", () => {
      expect(sync.serialize([testObject1, testObject2])).toEqual([
        { ___: "id-1" },
        { ___: "id-2" },
      ]);
      expect(sync.unserialize([{ ___: "id-1" }, { ___: "id-2" }])).toEqual([
        testObject1,
        testObject2,
      ]);
    });

    it("should serialize complex objects with items", () => {
      expect(
        sync.serialize({
          id1: [1, testObject1, { id2: testObject2 }, { id3: testObject1 }],
        })
      ).toEqual({
        id1: [
          1,
          { ___: "id-1" },
          { id2: { ___: "id-2" } },
          { id3: { ___: "id-1" } },
        ],
      });
      expect(
        sync.unserialize({
          id1: [
            1,
            { ___: "id-1" },
            { id2: { ___: "id-2" } },
            { id3: { ___: "id-1" } },
          ],
        })
      ).toEqual({
        id1: [1, testObject1, { id2: testObject2 }, { id3: testObject1 }],
      });
    });
  });
});
