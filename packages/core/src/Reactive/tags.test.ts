import { zzEvent } from "../Event";
import { zzBoolean, zzInteger, zzString } from "./vars";
import { zzT } from "./tags";

describe("zz tag", () => {
  it("should create an reactive string", () => {
    expect(zzT).toBeInstanceOf(Function);
    const string = zzT``;

    expect(string.onChange).toBeInstanceOf(zzEvent);
  });

  it("should calculate an reactive string", () => {
    const var1 = new zzString("abc");
    const var2 = new zzInteger(2998);
    const var3 = new zzBoolean(false);
    const string = zzT`is ${var1} as ${var2} == ${var3}`;

    expect(string.value).toBe("is abc as 2998 == false");

    var1.value = "null";
    var2.value = 0;
    var3.value = true;

    expect(string.value).toBe("is null as 0 == true");
  });

  it("should call listener on every change", () => {
    const listener = jest.fn();

    const var1 = new zzString("abc");
    const var2 = new zzInteger(2998);
    const var3 = new zzBoolean(false);
    const string = zzT`is ${var1} as ${var2} == ${var3}`;
    expect(var1.onChange.countListeners()).toBe(1);
    expect(var2.onChange.countListeners()).toBe(1);
    expect(var3.onChange.countListeners()).toBe(1);

    string.onChange.addListener(listener);
    expect(string.value).toBe("is abc as 2998 == false");
    expect(listener.mock.calls.length).toBe(0);
    expect(var1.onChange.countListeners()).toBe(1);
    expect(var2.onChange.countListeners()).toBe(1);
    expect(var3.onChange.countListeners()).toBe(1);

    var1.value = "try it";
    var2.value = 0;
    var3.value = true;

    expect(listener.mock.calls.length).toBe(3);
    expect(string.value).toBe("is try it as 0 == true");

    string.onChange.removeListener(listener);
    expect(var1.onChange.countListeners()).toBe(1);
    expect(var2.onChange.countListeners()).toBe(1);
    expect(var3.onChange.countListeners()).toBe(1);
    expect(string.value).toBe("is try it as 0 == true");
  });
});
