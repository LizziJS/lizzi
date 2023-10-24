import { zzDestructorsObserver } from "../../Destructor";
import { zzEvent } from "../../Event";
import { zzComputeFn } from "../compute";
import { ReactiveEventChange } from "../reactive";
import { zzInteger } from "../vars";
import { zzArray } from "./array";
import { zzComputeArrayFn } from "./compute";
import { zzArrayFlat } from "./flat";
import { zzArrayMap } from "./map";
import {
  ReactiveArrayEventAdd,
  ReactiveArrayEventRemove,
} from "./readonlyArray";

describe("zzArray", () => {
  describe("zzArray functionality", () => {
    it("should create an array", () => {
      expect(zzArray).toBeInstanceOf(Function);
      const array = new zzArray();

      expect(array.onAdd).toBeInstanceOf(zzEvent);
      expect(array.onChange).toBeInstanceOf(zzEvent);
      expect(array.onRemove).toBeInstanceOf(zzEvent);
    });

    it("should add items", () => {
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      const array = new zzArray();

      array.onAdd.addListener(listeners.add);
      array.onRemove.addListener(listeners.remove);
      array.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      array.add([1, 2]);

      expect(listeners.add.mock.calls.length).toBe(2);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(1);
      expect(array.toArray()).toEqual([1, 2]);
      expect(array.value).toEqual([1, 2]);

      array.add([3]);

      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(2);
      expect(array.toArray()).toEqual([1, 2, 3]);
      expect(array.value).toEqual([1, 2, 3]);

      expect(listeners.add.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventAdd(1, 0, array)
      );
      expect(listeners.add.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventAdd(2, 1, array)
      );
      expect(listeners.add.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventAdd(3, 2, array)
      );
    });

    it("should remove items", () => {
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      const array = new zzArray([1, 2, 3]);

      array.onAdd.addListener(listeners.add);
      array.onRemove.addListener(listeners.remove);
      array.onChange.addListener(listeners.change);

      array.remove([2]);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(1);
      expect(listeners.change.mock.calls.length).toBe(1);
      expect(array.toArray()).toEqual([1, 3]);
      expect(array.value).toEqual([1, 3]);

      array.remove([1, 3]);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(3);
      expect(listeners.change.mock.calls.length).toBe(2);
      expect(array.toArray()).toEqual([]);
      expect(array.value).toEqual([]);

      expect(listeners.remove.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventRemove(2, 1, array)
      );
      expect(listeners.remove.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventRemove(1, 0, array)
      );
      expect(listeners.remove.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventRemove(3, 0, array)
      );
    });

    it("should replace items", () => {
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      const array = new zzArray([1, 2, 3]);

      array.onAdd.addListener(listeners.add);
      array.onRemove.addListener(listeners.remove);
      array.onChange.addListener(listeners.change);

      array.replace([2, 4]);

      expect(listeners.add.mock.calls.length).toBe(1);
      expect(listeners.remove.mock.calls.length).toBe(2);
      expect(listeners.change.mock.calls.length).toBe(1);
      expect(array.toArray()).toEqual([2, 4]);
      expect(array.value).toEqual([2, 4]);

      expect(listeners.remove.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventRemove(1, 0, array)
      );
      expect(listeners.remove.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventRemove(3, 1, array)
      );
      expect(listeners.add.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventAdd(4, 1, array)
      );

      array.replace([3, 2, 1]);

      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(3);
      expect(listeners.change.mock.calls.length).toBe(2);
      expect(array.toArray()).toEqual([3, 2, 1]);
      expect(array.value).toEqual([3, 2, 1]);

      expect(listeners.remove.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventRemove(4, 1, array)
      );
      expect(listeners.add.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventAdd(3, 0, array)
      );
      expect(listeners.add.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventAdd(1, 2, array)
      );

      array.replace([1, 3, 2]);

      expect(listeners.add.mock.calls.length).toBe(5);
      expect(listeners.remove.mock.calls.length).toBe(5);
      expect(listeners.change.mock.calls.length).toBe(3);
      expect(array.toArray()).toEqual([1, 3, 2]);
      expect(array.value).toEqual([1, 3, 2]);

      expect(listeners.remove.mock.calls[3][0]).toEqual(
        new ReactiveArrayEventRemove(3, 0, array)
      );
      expect(listeners.remove.mock.calls[4][0]).toEqual(
        new ReactiveArrayEventRemove(2, 0, array)
      );
      expect(listeners.add.mock.calls[3][0]).toEqual(
        new ReactiveArrayEventAdd(3, 1, array)
      );
      expect(listeners.add.mock.calls[4][0]).toEqual(
        new ReactiveArrayEventAdd(2, 2, array)
      );
    });
  });

  describe("zzArray filter", () => {
    it("should create an array filter", () => {
      const filterFn = jest.fn();

      const array = new zzArray();
      const filter = array.filter(filterFn);

      expect(filter).toBeInstanceOf(zzArray);
      expect(filter).toBeInstanceOf(zzComputeArrayFn);
      expect(filter.onAdd).toBeInstanceOf(zzEvent);
      expect(filter.onChange).toBeInstanceOf(zzEvent);
      expect(filter.onRemove).toBeInstanceOf(zzEvent);
    });

    it("should filter items w/o listeners", () => {
      const filterFn = jest.fn((item) => item % 2 === 0);

      const array = new zzArray([1, 2]);

      const filter = array.filter(filterFn);
      expect(array.value).toEqual([1, 2]);
      expect(filter.value).toEqual([2]);
      expect(filter.toArray()).toEqual([2]);

      array.add([3, 4, 5]);
      expect(array.value).toEqual([1, 2, 3, 4, 5]);
      expect(filter.value).toEqual([2, 4]);
      expect(filter.toArray()).toEqual([2, 4]);

      array.remove([2, 3]);
      expect(array.value).toEqual([1, 4, 5]);
      expect(filter.value).toEqual([4]);
      expect(filter.toArray()).toEqual([4]);

      array.replace([6, 3, 4]);
      expect(array.value).toEqual([6, 3, 4]);
      expect(filter.value).toEqual([6, 4]);
      expect(filter.toArray()).toEqual([6, 4]);
    });

    it("should filter items with listeners", () => {
      const filterFn = jest.fn((item) => item % 2 === 0);

      const array = new zzArray([1, 2]);
      const filter = array.filter(filterFn);
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      filter.onAdd.addListener(listeners.add);
      filter.onRemove.addListener(listeners.remove);
      filter.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      array.add([3, 4, 5, 6, 7]);
      expect(listeners.add.mock.calls.length).toBe(2);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(1);
      expect(array.value).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(filter.value).toEqual([2, 4, 6]);
      expect(filter.toArray()).toEqual([2, 4, 6]);

      expect(listeners.add.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventAdd(4, 1, filter)
      );
      expect(listeners.add.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventAdd(6, 2, filter)
      );

      array.remove([2, 3, 7]);
      expect(listeners.add.mock.calls.length).toBe(2);
      expect(listeners.remove.mock.calls.length).toBe(1);
      expect(listeners.change.mock.calls.length).toBe(2);
      expect(array.value).toEqual([1, 4, 5, 6]);
      expect(filter.value).toEqual([4, 6]);
      expect(filter.toArray()).toEqual([4, 6]);

      expect(listeners.remove.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventRemove(2, 0, filter)
      );

      array.replace([5, 4, 8, 9]);
      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(2);
      expect(listeners.change.mock.calls.length).toBe(3);
      expect(array.value).toEqual([5, 4, 8, 9]);
      expect(filter.value).toEqual([4, 8]);
      expect(filter.toArray()).toEqual([4, 8]);

      expect(listeners.remove.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventRemove(6, 1, filter)
      );
      expect(listeners.add.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventAdd(8, 1, filter)
      );
    });

    it("should filter items with parameter w/o listeners", () => {
      const less = new zzInteger(5);
      const array = new zzArray([1, 2, 3, 4]);

      const filterFn = jest.fn((item) => item < less.value);
      const filter = array.filter(filterFn);

      expect(filter.value).toEqual([1, 2, 3, 4]);
      expect(filterFn.mock.calls.length).toBe(4);

      less.value = 0;
      expect(filter.value).toEqual([]);
      expect(filterFn.mock.calls.length).toBe(8);

      less.value = 5;
      expect(filter.value).toEqual([1, 2, 3, 4]);
      expect(filterFn.mock.calls.length).toBe(12);
    });

    it("should filter items with parameter with listeners", () => {
      const less = new zzInteger(5);
      const array = new zzArray([1, 2, 3, 4]);

      const filterFn = jest.fn((item) => item < less.value);

      const listener = zzDestructorsObserver.catch(() => {
        const filter = array.filter(filterFn);

        const listeners = {
          add: jest.fn(),
          remove: jest.fn(),
          change: jest.fn(),
        };

        expect(less.onChange.countListeners()).toBe(1);

        filter.onAdd.addListener(listeners.add);
        filter.onRemove.addListener(listeners.remove);
        filter.onChange.addListener(listeners.change);

        expect(less.onChange.countListeners()).toBe(1);

        expect(filter.value).toEqual([1, 2, 3, 4]);
        expect(filterFn.mock.calls.length).toBe(4);
        expect(less.onChange.countListeners()).toBe(1);

        less.value = 0;
        expect(filter.value).toEqual([]);
        expect(filterFn.mock.calls.length).toBe(8);
        expect(less.onChange.countListeners()).toBe(1);

        less.value = 5;
        expect(filter.value).toEqual([1, 2, 3, 4]);
        expect(filterFn.mock.calls.length).toBe(12);
        expect(less.onChange.countListeners()).toBe(1);

        less.value = 2;
        expect(filter.value).toEqual([1]);
        expect(filterFn.mock.calls.length).toBe(16);
        expect(less.onChange.countListeners()).toBe(1);
      });

      listener.destroy();
      expect(less.onChange.countListeners()).toBe(0);
    });

    it("should fire one onChange per one change", () => {
      const less = new zzInteger(10);
      const array = new zzArray([1, 2, 3, 4]);

      const filterFn1 = jest.fn((item) => item < less.value);
      const filterFn2 = jest.fn((item) => item < less.value);

      const filter1 = array.filter(filterFn1);
      const filter2 = filter1.filter(filterFn2);

      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      expect(filterFn1.mock.calls.length).toBe(4);
      expect(filterFn2.mock.calls.length).toBe(4);
      expect(less.onChange.countListeners()).toBe(2);

      filter2.onAdd.addListener(listeners.add);
      filter2.onRemove.addListener(listeners.remove);
      filter2.onChange.addListener(listeners.change);

      expect(less.onChange.countListeners()).toBe(2);

      expect(filter2.value).toEqual([1, 2, 3, 4]);
      expect(filterFn1.mock.calls.length).toBe(4);
      expect(filterFn2.mock.calls.length).toBe(4);
      expect(listeners.change.mock.calls.length).toBe(0);
      expect(less.onChange.countListeners()).toBe(2);

      array.add([1, 2]);
      expect(filter2.value).toEqual([1, 2, 3, 4, 1, 2]);
      expect(filterFn1.mock.calls.length).toBe(10);
      expect(filterFn2.mock.calls.length).toBe(10);
      expect(listeners.change.mock.calls.length).toBe(1);
      expect(less.onChange.countListeners()).toBe(2);
    });

    it("should add listeners to sub-items", () => {
      const array = new zzArray(
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map<{ id: zzInteger }>((value) => ({
          id: new zzInteger(value),
        }))
      );
      const lessId = new zzInteger(5);
      const filterFn = jest.fn(
        (item: { id: zzInteger }) => item.id.value < lessId.value
      );

      let filter;

      const listener = zzDestructorsObserver.catch(() => {
        filter = array.filter(filterFn);
      });

      expect(filterFn.mock.calls.length).toBe(9);
      expect(array.onChange.countListeners()).toBe(1);
      for (const item of array) {
        expect(item.id.onChange.countListeners()).toBe(1);
      }
      expect(lessId.onChange.countListeners()).toBe(1);

      expect(JSON.stringify(filter)).toEqual(
        JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      );
      expect(filterFn.mock.calls.length).toBe(9);
      expect(array.onChange.countListeners()).toBe(1);
      for (const item of array) {
        expect(item.id.onChange.countListeners()).toBe(1);
      }

      array.toArray()[0].id.value = 5;
      expect(filterFn.mock.calls.length).toBe(18);
      expect(JSON.stringify(filter)).toEqual(
        JSON.stringify([{ id: 2 }, { id: 3 }, { id: 4 }])
      );

      array.toArray()[7].id.value = 1;
      expect(filterFn.mock.calls.length).toBe(27);
      expect(JSON.stringify(filter)).toEqual(
        JSON.stringify([{ id: 2 }, { id: 3 }, { id: 4 }, { id: 1 }])
      );

      lessId.value = 7;
      expect(filterFn.mock.calls.length).toBe(36);
      expect(JSON.stringify(filter)).toEqual(
        JSON.stringify([
          { id: 5 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 1 },
        ])
      );

      listener.destroy();
      expect(filterFn.mock.calls.length).toBe(36);
      expect(array.onChange.countListeners()).toBe(0);
      for (const item of array) {
        expect(item.id.onChange.countListeners()).toBe(0);
      }
      expect(lessId.onChange.countListeners()).toBe(0);

      expect(JSON.stringify(filter)).toEqual(
        JSON.stringify([
          { id: 5 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 1 },
        ])
      );
    });

    it("should not add listeners from events", () => {
      const array = new zzArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const dontTouch = new zzInteger(0);
      const lessId = new zzInteger(5);
      const filterFn = jest.fn((item: number) => item < lessId.value);

      const listeners = {
        add: jest.fn(() => (dontTouch.value += 1)),
        remove: jest.fn(() => (dontTouch.value += 100)),
        change: jest.fn(() => (dontTouch.value += 10000)),
      };

      const filter = array.filter(filterFn);
      filter.onAdd.addListener(listeners.add);
      filter.onRemove.addListener(listeners.remove);
      filter.onChange.addListener(listeners.change);

      expect(lessId.onChange.countListeners()).toBe(1);
      expect(dontTouch.onChange.countListeners()).toBe(0);

      expect(filter.value).toEqual([1, 2, 3, 4]);
      expect(filterFn.mock.calls.length).toBe(9);

      lessId.value = 7;

      expect(filter.value).toEqual([1, 2, 3, 4, 5, 6]);
      expect(filterFn.mock.calls.length).toBe(18);

      expect(lessId.onChange.countListeners()).toBe(1);
      expect(dontTouch.value).toBe(10002);
      expect(dontTouch.onChange.countListeners()).toBe(0);
    });
  });

  describe("zzArray map", () => {
    it("should create an array map", () => {
      const mapFn = jest.fn();

      const array = new zzArray();
      const map = array.map(mapFn);

      expect(map).toBeInstanceOf(zzArray);
      expect(map).toBeInstanceOf(zzArrayMap);
      expect(map.onAdd).toBeInstanceOf(zzEvent);
      expect(map.onChange).toBeInstanceOf(zzEvent);
      expect(map.onRemove).toBeInstanceOf(zzEvent);
    });

    it("should map items w/o listeners", () => {
      const mapFn = jest.fn((value) => value * 2);

      const array = new zzArray([1, 2]);

      const map = array.map(mapFn);
      expect(array.value).toEqual([1, 2]);
      expect(map.value).toEqual([2, 4]);
      expect(map.toArray()).toEqual([2, 4]);

      array.add([3, 4, 5]);
      expect(array.value).toEqual([1, 2, 3, 4, 5]);
      expect(map.value).toEqual([2, 4, 6, 8, 10]);
      expect(map.toArray()).toEqual([2, 4, 6, 8, 10]);

      array.remove([1, 2, 4]);
      expect(array.value).toEqual([3, 5]);
      expect(map.value).toEqual([6, 10]);
      expect(map.toArray()).toEqual([6, 10]);

      array.replace([2, 3, 8]);
      expect(array.value).toEqual([2, 3, 8]);
      expect(map.value).toEqual([4, 6, 16]);
      expect(map.toArray()).toEqual([4, 6, 16]);
    });

    it("should map items with listeners", () => {
      const mapFn = jest.fn((value) => value * 2);

      const array = new zzArray([1, 2]);
      const map = array.map(mapFn);
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      map.onAdd.addListener(listeners.add);
      map.onRemove.addListener(listeners.remove);
      map.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      array.add([3, 4]);

      expect(array.value).toEqual([1, 2, 3, 4]);
      expect(map.value).toEqual([2, 4, 6, 8]);
      expect(map.toArray()).toEqual([2, 4, 6, 8]);
      expect(listeners.add.mock.calls.length).toBe(2);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(1);

      expect(listeners.add.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventAdd(6, 2, map)
      );
      expect(listeners.add.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventAdd(8, 3, map)
      );

      array.remove([2, 4]);

      expect(array.value).toEqual([1, 3]);
      expect(map.value).toEqual([2, 6]);
      expect(map.toArray()).toEqual([2, 6]);
      expect(listeners.add.mock.calls.length).toBe(2);
      expect(listeners.remove.mock.calls.length).toBe(2);
      expect(listeners.change.mock.calls.length).toBe(2);

      expect(listeners.remove.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventRemove(4, 1, map)
      );
      expect(listeners.remove.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventRemove(8, 2, map)
      );

      array.replace([5, 3, 1]);

      expect(array.value).toEqual([5, 3, 1]);
      expect(map.value).toEqual([10, 6, 2]);
      expect(map.toArray()).toEqual([10, 6, 2]);
      expect(listeners.add.mock.calls.length).toBe(4);
      expect(listeners.remove.mock.calls.length).toBe(3);
      expect(listeners.change.mock.calls.length).toBe(3);

      expect(listeners.remove.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventRemove(2, 0, map)
      );
      expect(listeners.add.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventAdd(10, 0, map)
      );
      expect(listeners.add.mock.calls[3][0]).toEqual(
        new ReactiveArrayEventAdd(2, 2, map)
      );
    });
  });

  describe("zzArray includes", () => {
    it("should create an array includes", () => {
      const array = new zzArray();
      const check = array.includes(4);

      expect(check).toBeInstanceOf(zzComputeFn);
    });

    it("should be true if include", () => {
      const array = new zzArray([1, 4, 2]);
      const check = array.includes(4);

      expect(check.value).toBe(true);

      array.replace([6, 4, 2, 0]);

      expect(check.value).toBe(true);
    });

    it("should be false if not include", () => {
      const array = new zzArray([1, 2]);
      const check = array.includes(4);

      expect(check.value).toBe(false);

      array.replace([12, 0]);

      expect(check.value).toBe(false);
    });

    it("should change value", () => {
      const array = new zzArray([1, 2]);
      const check = array.includes(4);

      expect(check.value).toBe(false);

      array.add([3, 4, 5]);

      expect(check.value).toBe(true);

      array.remove([4, 5, 2]);

      expect(check.value).toBe(false);
    });

    it("should change value with listener", () => {
      const array = new zzArray([1, 2]);
      const check = array.includes(4);
      const listener = jest.fn();

      check.onChange.addListener(listener);

      expect(check.value).toBe(false);
      expect(listener.mock.calls.length).toBe(0);

      array.add([3, 4, 5]);

      expect(check.value).toBe(true);
      expect(listener.mock.calls.length).toBe(1);
      expect(listener.mock.calls[0][0]).toEqual(
        new ReactiveEventChange(true, false, check)
      );

      array.add([6, 7]);

      expect(check.value).toBe(true);
      expect(listener.mock.calls.length).toBe(1);

      array.remove([4, 5, 2]);

      expect(check.value).toBe(false);
      expect(listener.mock.calls.length).toBe(2);
      expect(listener.mock.calls[1][0]).toEqual(
        new ReactiveEventChange(false, true, check)
      );

      array.replace([]);

      expect(check.value).toBe(false);
      expect(listener.mock.calls.length).toBe(2);
    });
  });

  describe("zzArray find", () => {
    it("should create an array find", () => {
      const array = new zzArray();
      const find = array.find((value) => value === 4);

      expect(find).toBeInstanceOf(zzComputeFn);
    });

    it("should be object if found", () => {
      const findFn = jest.fn((value) => value === 4);
      const array = new zzArray([1, 4, 2]);
      const find = array.find(findFn);

      expect(findFn.mock.calls.length).toBe(2);

      expect(find.value).toBe(4);
      expect(findFn.mock.calls.length).toBe(2);

      array.replace([6, 4, 2, 0]);

      expect(find.value).toBe(4);
      expect(findFn.mock.calls.length).toBe(4);
    });

    it("should be undefined if not found", () => {
      const findFn = jest.fn((value) => value === 4);
      const array = new zzArray([1, 2]);
      const find = array.find(findFn);

      expect(findFn.mock.calls.length).toBe(2);

      expect(find.value).toBe(undefined);
      expect(findFn.mock.calls.length).toBe(2);

      array.replace([6, 9, 2, 0]);

      expect(find.value).toBe(undefined);
      expect(findFn.mock.calls.length).toBe(6);
    });

    it("should change value with listener", () => {
      const findFn = jest.fn((value) => value === 4);
      const array = new zzArray([1, 2]);
      const find = array.find(findFn);
      const listener = jest.fn();

      find.onChange.addListener(listener);

      expect(listener.mock.calls.length).toBe(0);
      expect(find.value).toBe(undefined);

      array.add([6, 2]);

      expect(listener.mock.calls.length).toBe(0);
      expect(find.value).toBe(undefined);

      array.replace([6, 4, 2, 0]);

      expect(listener.mock.calls.length).toBe(1);
      expect(listener.mock.calls[0][0]).toEqual(
        new ReactiveEventChange(4, undefined, find)
      );
      expect(find.value).toBe(4);

      array.remove([0]);

      expect(listener.mock.calls.length).toBe(1);
      expect(find.value).toBe(4);

      array.remove([0, 2, 4]);

      expect(listener.mock.calls.length).toBe(2);
      expect(listener.mock.calls[1][0]).toEqual(
        new ReactiveEventChange(undefined, 4, find)
      );
      expect(find.value).toBe(undefined);
    });

    it("should find value with dependency listener", () => {
      const dependency = new zzInteger(4);
      const findFn = jest.fn((value) => value === dependency.value);
      const array = new zzArray([1, 2]);
      const find = array.find(findFn);
      const listener = jest.fn();

      expect(findFn.mock.calls.length).toBe(2);
      expect(listener.mock.calls.length).toBe(0);

      find.onChange.addListener(listener);

      expect(findFn.mock.calls.length).toBe(2);
      expect(listener.mock.calls.length).toBe(0);

      expect(find.value).toBe(undefined);
      expect(findFn.mock.calls.length).toBe(2);

      array.add([6, 2]);

      expect(array.value).toEqual([1, 2, 6, 2]);
      expect(findFn.mock.calls.length).toBe(6);
      expect(listener.mock.calls.length).toBe(0);
      expect(find.value).toBe(undefined);

      dependency.value = 6;

      expect(findFn.mock.calls.length).toBe(9);
      expect(listener.mock.calls.length).toBe(1);
      expect(listener.mock.calls[0][0]).toEqual(
        new ReactiveEventChange(6, undefined, find)
      );
      expect(find.value).toBe(6);

      dependency.value = 2;

      expect(findFn.mock.calls.length).toBe(11);
      expect(listener.mock.calls.length).toBe(2);
      expect(listener.mock.calls[1][0]).toEqual(
        new ReactiveEventChange(2, 6, find)
      );
      expect(find.value).toBe(2);

      dependency.value = 5;

      expect(findFn.mock.calls.length).toBe(15);
      expect(listener.mock.calls.length).toBe(3);
      expect(listener.mock.calls[2][0]).toEqual(
        new ReactiveEventChange(undefined, 2, find)
      );
      expect(find.value).toBe(undefined);
    });
  });

  describe("zzArray sort", () => {
    it("should create an array sort", () => {
      const sortFn = jest.fn();

      const array = new zzArray();
      const sort = array.sort(sortFn);

      expect(sort).toBeInstanceOf(zzArray);
      expect(sort).toBeInstanceOf(zzComputeArrayFn);
      expect(sort.onAdd).toBeInstanceOf(zzEvent);
      expect(sort.onChange).toBeInstanceOf(zzEvent);
      expect(sort.onRemove).toBeInstanceOf(zzEvent);
    });

    it("should sort elements of array w/o listeners", () => {
      const sortFn = jest.fn((a, b) => a - b);

      const array = new zzArray([5, 9, 0]);
      const sort = array.sort(sortFn);

      expect(array.value).toEqual([5, 9, 0]);
      expect(sort.value).toEqual([0, 5, 9]);
      expect(sort.toArray()).toEqual([0, 5, 9]);

      array.add([4, 3, 7]);

      expect(array.value).toEqual([5, 9, 0, 4, 3, 7]);
      expect(sort.value).toEqual([0, 3, 4, 5, 7, 9]);
      expect(sort.toArray()).toEqual([0, 3, 4, 5, 7, 9]);

      array.remove([3, 9, 0]);

      expect(array.value).toEqual([5, 4, 7]);
      expect(sort.value).toEqual([4, 5, 7]);
      expect(sort.toArray()).toEqual([4, 5, 7]);

      array.replace([4, 3, 7]);

      expect(array.value).toEqual([4, 3, 7]);
      expect(sort.value).toEqual([3, 4, 7]);
      expect(sort.toArray()).toEqual([3, 4, 7]);
    });

    it("should sort elements of array with listener", () => {
      const sortFn = jest.fn((a, b) => a - b);

      const array = new zzArray([5, 9, 0]);
      const sort = array.sort(sortFn);
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      sort.onAdd.addListener(listeners.add);
      sort.onRemove.addListener(listeners.remove);
      sort.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      array.add([10, 3, 7]);

      expect(array.value).toEqual([5, 9, 0, 10, 3, 7]);
      expect(sort.value).toEqual([0, 3, 5, 7, 9, 10]);
      expect(sort.toArray()).toEqual([0, 3, 5, 7, 9, 10]);

      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(1);

      expect(listeners.add.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventAdd(3, 1, sort)
      );
      expect(listeners.add.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventAdd(7, 3, sort)
      );
      expect(listeners.add.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventAdd(10, 5, sort)
      );

      array.remove([3, 9, 0]);

      expect(array.value).toEqual([5, 10, 7]);
      expect(sort.value).toEqual([5, 7, 10]);
      expect(sort.toArray()).toEqual([5, 7, 10]);

      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(3);
      expect(listeners.change.mock.calls.length).toBe(2);

      expect(listeners.remove.mock.calls[0][0]).toEqual(
        new ReactiveArrayEventRemove(0, 0, sort)
      );
      expect(listeners.remove.mock.calls[1][0]).toEqual(
        new ReactiveArrayEventRemove(3, 0, sort)
      );
      expect(listeners.remove.mock.calls[2][0]).toEqual(
        new ReactiveArrayEventRemove(9, 2, sort)
      );

      array.replace([7, 3, 4]);

      expect(array.value).toEqual([7, 3, 4]);
      expect(sort.value).toEqual([3, 4, 7]);
      expect(sort.toArray()).toEqual([3, 4, 7]);

      expect(listeners.add.mock.calls.length).toBe(5);
      expect(listeners.remove.mock.calls.length).toBe(5);
      expect(listeners.change.mock.calls.length).toBe(3);

      expect(listeners.remove.mock.calls[3][0]).toEqual(
        new ReactiveArrayEventRemove(5, 0, sort)
      );
      expect(listeners.remove.mock.calls[4][0]).toEqual(
        new ReactiveArrayEventRemove(10, 1, sort)
      );
      expect(listeners.add.mock.calls[3][0]).toEqual(
        new ReactiveArrayEventAdd(3, 0, sort)
      );
      expect(listeners.add.mock.calls[4][0]).toEqual(
        new ReactiveArrayEventAdd(4, 1, sort)
      );
    });
  });

  describe("zzArray flat", () => {
    it("should create an array flat", () => {
      const array = new zzArray();
      const flat = array.flat();

      expect(flat).toBeInstanceOf(zzArrayFlat);
      expect(flat.onAdd).toBeInstanceOf(zzEvent);
      expect(flat.onChange).toBeInstanceOf(zzEvent);
      expect(flat.onRemove).toBeInstanceOf(zzEvent);
    });

    it("should create an array flat with level 0", () => {
      const array = new zzArray([5, 9, 0]);
      const flat = array.flat();
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      flat.onAdd.addListener(listeners.add);
      flat.onRemove.addListener(listeners.remove);
      flat.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      array.add([10, 3, 7]);

      expect(array.value).toEqual([5, 9, 0, 10, 3, 7]);
      expect(flat.value).toEqual([5, 9, 0, 10, 3, 7]);
      expect(flat.toArray()).toEqual([5, 9, 0, 10, 3, 7]);

      expect(listeners.add.mock.calls.length).toBe(3);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(3);

      array.add([1, 2], 2);
      expect(array.value).toEqual([5, 9, 1, 2, 0, 10, 3, 7]);
      expect(flat.value).toEqual([5, 9, 1, 2, 0, 10, 3, 7]);
      expect(flat.toArray()).toEqual([5, 9, 1, 2, 0, 10, 3, 7]);

      expect(listeners.add.mock.calls.length).toBe(5);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(5);

      array.remove([1, 5, 7]);
      expect(array.value).toEqual([9, 2, 0, 10, 3]);
      expect(flat.value).toEqual([9, 2, 0, 10, 3]);
      expect(flat.toArray()).toEqual([9, 2, 0, 10, 3]);

      expect(listeners.add.mock.calls.length).toBe(5);
      expect(listeners.remove.mock.calls.length).toBe(3);
      expect(listeners.change.mock.calls.length).toBe(8);
    });

    it("should flat empty array with level 1", () => {
      type NotFlat = number | zzArray<NotFlat>;

      const s1 = new zzArray<NotFlat>([]);
      const array = new zzArray<NotFlat>([5, s1, 9, 0]);
      const flat = array.flat();
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      flat.onAdd.addListener(listeners.add);
      flat.onRemove.addListener(listeners.remove);
      flat.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      expect(array.value).toEqual([5, s1, 9, 0]);
      expect(flat.value).toEqual([5, 9, 0]);
      expect(flat.toArray()).toEqual([5, 9, 0]);

      array.remove([s1]);
      expect(array.value).toEqual([5, 9, 0]);
      expect(flat.value).toEqual([5, 9, 0]);
      expect(flat.toArray()).toEqual([5, 9, 0]);

      array.add([s1], 2);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 0]);
      expect(flat.toArray()).toEqual([5, 9, 0]);
    });

    it("should flat and not empty array with level 1", () => {
      type NotFlat = number | zzArray<NotFlat>;

      const s1 = new zzArray<NotFlat>([]);
      const array = new zzArray<NotFlat>([0, s1]);
      const flat = array.flat();
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      flat.onAdd.addListener(listeners.add);
      flat.onRemove.addListener(listeners.remove);
      flat.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      expect(array.value).toEqual([0, s1]);
      expect(flat.value).toEqual([0]);

      s1.add([2]);
      expect(array.value).toEqual([0, s1]);
      expect(flat.value).toEqual([0, 2]);
    });

    it("should flat and not empty array with level 1", () => {
      type NotFlat = number | zzArray<NotFlat>;

      const s1 = new zzArray<NotFlat>([1, 2]);
      const array = new zzArray<NotFlat>([5, s1, 9, 0]);
      const flat = array.flat();
      const listeners = {
        add: jest.fn(),
        remove: jest.fn(),
        change: jest.fn(),
      };

      flat.onAdd.addListener(listeners.add);
      flat.onRemove.addListener(listeners.remove);
      flat.onChange.addListener(listeners.change);

      expect(listeners.add.mock.calls.length).toBe(0);
      expect(listeners.remove.mock.calls.length).toBe(0);
      expect(listeners.change.mock.calls.length).toBe(0);

      expect(array.value).toEqual([5, s1, 9, 0]);
      expect(flat.value).toEqual([5, 1, 2, 9, 0]);

      array.remove([s1]);
      expect(array.value).toEqual([5, 9, 0]);
      expect(flat.value).toEqual([5, 9, 0]);

      array.add([s1], 2);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 1, 2, 0]);

      s1.add([3, 4], 1);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 1, 3, 4, 2, 0]);

      s1.remove([1, 4]);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 3, 2, 0]);

      s1.remove([3, 2]);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 0]);

      s1.add([3], 0);
      expect(array.value).toEqual([5, 9, s1, 0]);
      expect(flat.value).toEqual([5, 9, 3, 0]);
    });
  });
});
