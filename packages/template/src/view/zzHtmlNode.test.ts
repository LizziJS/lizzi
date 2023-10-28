import { zzObject, zzReactive, zzString } from "@lizzi/core";
import { Value } from "./zzHtmlNode";
import { TextNodeView } from ".";
import { zzNode } from "@lizzi/node";

describe("ReactiveValueView", () => {
  it("should create an ReactiveValueView", () => {
    expect(Value).toBeInstanceOf(Function);
    const view = new Value({ children: new zzString("test") });

    expect(view).toBeInstanceOf(Value);
  });

  it("should use text node for zzString", () => {
    const string = new zzString("test");
    const view = new Value({ children: string });

    const addMock = jest.fn();
    const removeMock = jest.fn();

    view.childNodes.onAdd.addListener(addMock);
    view.childNodes.onRemove.addListener(removeMock);

    expect(view.childNodes.length).toBe(0);

    view._mount();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(1);
    expect(removeMock).toBeCalledTimes(0);

    string.value = "test2";

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(1);
    expect(removeMock).toBeCalledTimes(0);

    string.value = "test4";

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(1);
    expect(removeMock).toBeCalledTimes(0);
  });

  it("should use object node for zzObject", () => {
    const object = new zzObject<zzNode>(null);
    const view = new Value({ children: object });

    const addMock = jest.fn();
    const removeMock = jest.fn();

    view.childNodes.onAdd.addListener(addMock);
    view.childNodes.onRemove.addListener(removeMock);

    expect(view.childNodes.length).toBe(0);

    view._mount();

    expect(view.childNodes.length).toBe(0);
    expect(addMock).toBeCalledTimes(0);
    expect(removeMock).toBeCalledTimes(0);

    object.value = new zzNode();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBe(object.value);
    expect(addMock).toBeCalledTimes(1);
    expect(removeMock).toBeCalledTimes(0);

    object.value = new zzNode();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBe(object.value);
    expect(addMock).toBeCalledTimes(2);
    expect(removeMock).toBeCalledTimes(1);

    object.value = null;

    expect(view.childNodes.length).toBe(0);
    expect(addMock).toBeCalledTimes(2);
    expect(removeMock).toBeCalledTimes(2);

    object.value = new zzNode();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBe(object.value);
    expect(addMock).toBeCalledTimes(3);
    expect(removeMock).toBeCalledTimes(2);
  });

  it("should change to text and back to object", () => {
    const object = new zzReactive<zzNode | string | null>("initial test");
    const view = new Value({ children: object });

    const addMock = jest.fn();
    const removeMock = jest.fn();

    view.childNodes.onAdd.addListener(addMock);
    view.childNodes.onRemove.addListener(removeMock);

    expect(view.childNodes.length).toBe(0);

    view._mount();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(1);
    expect(removeMock).toBeCalledTimes(0);

    object.value = new zzNode();

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBe(object.value);
    expect(addMock).toBeCalledTimes(2);
    expect(removeMock).toBeCalledTimes(1);

    object.value = "back to text";

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(3);
    expect(removeMock).toBeCalledTimes(2);

    object.value = null;

    expect(view.childNodes.length).toBe(0);
    expect(addMock).toBeCalledTimes(3);
    expect(removeMock).toBeCalledTimes(3);

    object.value = "back to text again";

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(4);
    expect(removeMock).toBeCalledTimes(3);

    object.value = "should not change instance";

    expect(view.childNodes.length).toBe(1);
    expect(view.childNodes.toArray()[0]).toBeInstanceOf(TextNodeView);
    expect(addMock).toBeCalledTimes(4);
    expect(removeMock).toBeCalledTimes(3);
  });
});
