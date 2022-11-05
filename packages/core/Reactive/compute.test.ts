import { zzEvent } from "../Event";
import { zzComputeFn } from "./compute";
import { zzInteger } from "./vars";

describe('zzCompute', () =>
{
    describe('zzCompute functionality', () => {
        it('should create an compute', () => {
            expect(zzComputeFn).toBeInstanceOf(Function);
            const compute = new zzComputeFn(() => false);

            expect(compute.onChange).toBeInstanceOf(zzEvent);
        });

        it('should get value w/o listener', () =>
        {
            let value = 0;
            const compute = new zzComputeFn(() => value);

            expect(compute.value).toBe(0);

            value = 1;
            expect(compute.value).toBe(1);
        });

        it('should save old value with listener', () =>
        {
            let value = 0;
            const compute = new zzComputeFn(() => value);

            expect(compute.value).toBe(0);
            compute.onChange.addListener(() => {});

            value = 1;
            expect(compute.value).toBe(0);
        });

        it('should change value only if dependency value changed', () =>
        {
            const listener = jest.fn();
            let value = new zzInteger(0);
            const compute = new zzComputeFn(() => value.value, value);

            expect(compute.value).toBe(0);
            compute.onChange.addListener(listener);
            expect(listener.mock.calls.length).toBe(0);

            value.value = 1;
            expect(compute.value).toBe(1);
            expect(listener.mock.calls.length).toBe(1);
        });

        it('should change value only if dependency event fired', () =>
        {
            const listener = jest.fn();
            let value = 0;
            let event = new zzEvent();
            const compute = new zzComputeFn(() => value, event);

            expect(compute.value).toBe(0);
            compute.onChange.addListener(listener);

            value = 1;
            expect(compute.value).toBe(0);
            expect(listener.mock.calls.length).toBe(0);

            event.emit();
            expect(compute.value).toBe(1);
            expect(listener.mock.calls.length).toBe(1);
        });

        it('should remove dependencies if listener removed', () =>
        {
            const listener = jest.fn();
            let value = new zzInteger(0);
            let event = new zzEvent();
            const compute = new zzComputeFn(() => value.value, event, value);

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
    });
});


