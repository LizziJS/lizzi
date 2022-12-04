import { zzEvent } from "../Event";
import { zzComputeFn } from "./compute";
import { zzObject } from "./object";
import { zzReactive } from "./Reactive";
import { zzBoolean, zzInteger, zzString } from "./vars";

describe("zzCompute", () => {
  describe("zzCompute functionality", () => {
    it("should create an compute", () => {
      expect(zzComputeFn).toBeInstanceOf(Function);
      const compute = new zzComputeFn(() => false);

      expect(compute).toBeInstanceOf(zzReactive);
      expect(compute.onChange).toBeInstanceOf(zzEvent);
    });

    it("should get value w/o listener", () => {
      let value = 0;
      const compute = new zzComputeFn(() => value);

      expect(compute.value).toBe(0);

      value = 1;
      expect(compute.value).toBe(1);
    });

    it("should save old value with listener", () => {
      const reactiveValue = new zzInteger(0);
      let value = 0;
      const compute = new zzComputeFn(() => reactiveValue.value + value);

      expect(compute.value).toBe(0);
      compute.onChange.addListener(() => {});

      value = 1;
      expect(compute.value).toBe(0);
    });

    it("should change value only if dependency value changed", () => {
      const listener = jest.fn();
      let value = new zzInteger(0);
      const compute = new zzComputeFn(() => value.value);

      expect(compute.value).toBe(0);
      compute.onChange.addListener(listener);
      expect(listener.mock.calls.length).toBe(0);

      value.value = 1;
      expect(compute.value).toBe(1);
      expect(listener.mock.calls.length).toBe(1);
    });

    it("should change value only if dependency event fired", () => {
      const listener = jest.fn();
      const reactiveValue = new zzInteger(0);
      let value = 0;
      let event = new zzEvent();
      const compute = new zzComputeFn(() => value + reactiveValue.value, event);

      expect(compute.value).toBe(0);
      compute.onChange.addListener(listener);

      value = 1;
      expect(compute.value).toBe(0);
      expect(listener.mock.calls.length).toBe(0);

      event.emit();
      expect(compute.value).toBe(1);
      expect(listener.mock.calls.length).toBe(1);
    });

    it("should remove dependencies if listener removed", () => {
      const listener = jest.fn();
      let value = new zzInteger(0);
      let event = new zzEvent();
      const compute = new zzComputeFn(() => value.value, event);

      expect(compute.value).toBe(0);
      expect(value.onChange.countListeners()).toBe(0);
      expect(event.countListeners()).toBe(0);

      compute.onChange.addListener(listener);
      expect(value.onChange.countListeners()).toBe(1);
      expect(event.countListeners()).toBe(1);

      value.value = 1;
      expect(compute.value).toBe(1);
      compute.onChange.removeListener(listener);
      expect(value.onChange.countListeners()).toBe(0);
      expect(event.countListeners()).toBe(0);

      value.value = 2;
      expect(compute.value).toBe(2);
    });

    it("should add and remove variables depedencies", () => {
      const listener = jest.fn();

      let value1 = new zzBoolean(false);
      let value2 = new zzBoolean(false);
      let value3 = new zzBoolean(false);

      const computeFn = jest.fn(
        () => value1.value && value2.value && value3.value
      );
      const compute = new zzComputeFn(computeFn);

      expect(computeFn.mock.calls.length).toBe(0);

      expect(compute.value).toBe(false);
      expect(computeFn.mock.calls.length).toBe(1);

      compute.onChange.addListener(listener);
      expect(listener.mock.calls.length).toBe(0);
      expect(computeFn.mock.calls.length).toBe(2);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(0);
      expect(value3.onChange.countListeners()).toBe(0);

      value1.value = true;
      expect(compute.value).toBe(false);
      expect(listener.mock.calls.length).toBe(0);
      expect(computeFn.mock.calls.length).toBe(3);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(1);
      expect(value3.onChange.countListeners()).toBe(0);

      value2.value = true;
      expect(compute.value).toBe(false);
      expect(listener.mock.calls.length).toBe(0);
      expect(computeFn.mock.calls.length).toBe(4);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(1);
      expect(value3.onChange.countListeners()).toBe(1);

      value3.value = true;
      expect(compute.value).toBe(true);
      expect(listener.mock.calls.length).toBe(1);
      expect(computeFn.mock.calls.length).toBe(5);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(1);
      expect(value3.onChange.countListeners()).toBe(1);

      value1.value = false;
      expect(compute.value).toBe(false);
      expect(listener.mock.calls.length).toBe(2);
      expect(computeFn.mock.calls.length).toBe(6);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(0);
      expect(value3.onChange.countListeners()).toBe(0);
    });

    it("should not add depedencies to nested computed variables", () => {
      const listener = jest.fn();

      let value1 = new zzInteger(1);
      let value2 = new zzInteger(2);
      let value3 = new zzInteger(3);

      const computeFn1 = jest.fn(() => value1.value + value2.value);
      const compute1 = new zzComputeFn(computeFn1);

      const computeFn2 = jest.fn(() => value3.value + compute1.value);
      const compute2 = new zzComputeFn(computeFn2);

      expect(compute2.value).toBe(6);
      expect(value1.onChange.countListeners()).toBe(0);
      expect(value3.onChange.countListeners()).toBe(0);
      expect(value2.onChange.countListeners()).toBe(0);

      compute2.onChange.addListener(listener);

      expect(listener.mock.calls.length).toBe(0);
      expect(value1.onChange.countListeners()).toBe(1);
      expect(value2.onChange.countListeners()).toBe(1);
      expect(value3.onChange.countListeners()).toBe(1);
      expect(compute2.value).toBe(6);

      compute2.onChange.removeListener(listener);

      expect(listener.mock.calls.length).toBe(0);
      expect(value1.onChange.countListeners()).toBe(0);
      expect(value2.onChange.countListeners()).toBe(0);
      expect(value3.onChange.countListeners()).toBe(0);
      expect(compute2.value).toBe(6);
    });

    it("should add listener to nested object reactive variables", () => {
      const listener = jest.fn();

      let str1 = new zzString("string1");
      let str2 = new zzString("other2");
      let obj21 = new zzObject<{ str: typeof str1 }>({ str: str1 });
      let obj22 = new zzObject<{ str: typeof str2 }>({ str: str2 });
      let obj1 = new zzObject<{ obj2: typeof obj21 }>(null);

      const computeFn = jest.fn(() => obj1.value?.obj2.value?.str.value);
      const compute = new zzComputeFn(computeFn);

      expect(compute.value).toBe(undefined);
      expect(obj1.onChange.countListeners()).toBe(0);
      expect(obj21.onChange.countListeners()).toBe(0);
      expect(obj22.onChange.countListeners()).toBe(0);
      expect(str1.onChange.countListeners()).toBe(0);
      expect(str2.onChange.countListeners()).toBe(0);

      compute.onChange.addListener(listener);

      expect(listener.mock.calls.length).toBe(0);
      expect(obj1.onChange.countListeners()).toBe(1);
      expect(obj21.onChange.countListeners()).toBe(0);
      expect(obj22.onChange.countListeners()).toBe(0);
      expect(str1.onChange.countListeners()).toBe(0);
      expect(str2.onChange.countListeners()).toBe(0);

      obj1.value = { obj2: obj21 };

      expect(compute.value).toBe("string1");
      expect(listener.mock.calls.length).toBe(1);
      expect(obj1.onChange.countListeners()).toBe(1);
      expect(obj21.onChange.countListeners()).toBe(1);
      expect(obj22.onChange.countListeners()).toBe(0);
      expect(str1.onChange.countListeners()).toBe(1);
      expect(str2.onChange.countListeners()).toBe(0);

      obj1.value = { obj2: obj22 };

      expect(compute.value).toBe("other2");
      expect(listener.mock.calls.length).toBe(2);
      expect(obj1.onChange.countListeners()).toBe(1);
      expect(obj21.onChange.countListeners()).toBe(0);
      expect(obj22.onChange.countListeners()).toBe(1);
      expect(str1.onChange.countListeners()).toBe(0);
      expect(str2.onChange.countListeners()).toBe(1);

      obj22.value = { str: str1 };
      expect(compute.value).toBe("string1");
      expect(listener.mock.calls.length).toBe(3);
      expect(obj1.onChange.countListeners()).toBe(1);
      expect(obj21.onChange.countListeners()).toBe(0);
      expect(obj22.onChange.countListeners()).toBe(1);
      expect(str1.onChange.countListeners()).toBe(1);
      expect(str2.onChange.countListeners()).toBe(0);
    });
  });
});
