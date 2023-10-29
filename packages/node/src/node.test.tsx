import { ExtractEventListener, zzEvent, zzReactive } from "@lizzi/core";
import { zzNode } from "./node";

class TestNode extends zzNode {
  append(node: zzNode | zzNode[]): void {
    super.append(node);
  }

  remove(node: zzNode | zzNode[]): void {
    super.remove(node);
  }

  constructor({ use }: { use?: (view: TestNode) => void } = {}) {
    super();

    this.configUseProp(use);
  }
}

class TestEventNode extends zzNode {
  readonly onTest = new zzEvent<(value: string) => void>();
  readonly testValue = new zzReactive<string>("");

  constructor({
    onTest,
    testValue,
  }: {
    onTest?: ExtractEventListener<TestEventNode["onTest"]>;
    testValue?: string;
  } = {}) {
    super();

    this.setConfigProps({ onTest, testValue });
  }
}

describe("zzNode", () => {
  it("should create zzNode", () => {
    const node = new zzNode();
    expect(node).toBeInstanceOf(zzNode);
  });

  it("should append and remove zzNode and zzNode[] in zzNode", () => {
    const node = new TestNode();
    const childNode = new TestNode();

    node.append(childNode);
    expect(node.childNodes.toArray()).toContain(childNode);

    node.remove(childNode);
    expect(node.childNodes.toArray()).not.toContain(childNode);

    expect(node.childNodes.toArray()).toHaveLength(0);

    const childNode1 = new TestNode();
    const childNode2 = new TestNode();
    const childNode3 = new TestNode();
    const childNode4 = new TestNode();

    node.append([childNode1, childNode2, childNode3, childNode4]);
    expect(node.childNodes.toArray()).toContain(childNode1);
    expect(node.childNodes.toArray()).toContain(childNode2);
    expect(node.childNodes.toArray()).toContain(childNode3);
    expect(node.childNodes.toArray()).toContain(childNode4);

    node.remove([childNode3, childNode2]);
    expect(node.childNodes.toArray()).toContain(childNode1);
    expect(node.childNodes.toArray()).not.toContain(childNode2);
    expect(node.childNodes.toArray()).not.toContain(childNode3);
    expect(node.childNodes.toArray()).toContain(childNode4);

    expect(node.childNodes.toArray()).toHaveLength(2);

    node.remove([childNode4, childNode1]);
    expect(node.childNodes.toArray()).not.toContain(childNode1);
    expect(node.childNodes.toArray()).not.toContain(childNode2);
    expect(node.childNodes.toArray()).not.toContain(childNode3);
    expect(node.childNodes.toArray()).not.toContain(childNode4);

    expect(node.childNodes.toArray()).toHaveLength(0);
  });

  it("should mount and unmount zzNode", () => {
    const unmountFn = jest.fn();
    const mountFn = jest.fn((view: TestNode) => {
      view.onceUnmount(unmountFn);
    });

    const node = new TestNode({ use: (view: TestNode) => mountFn(view) });

    expect(mountFn).toHaveBeenCalledTimes(0);
    expect(unmountFn).toHaveBeenCalledTimes(0);
    expect(node.nodeState).toBe("unmounted");

    node._mount();

    expect(mountFn).toHaveBeenCalledTimes(1);
    expect(unmountFn).toHaveBeenCalledTimes(0);
    expect(node.nodeState).toBe("mounted");

    node._mount();

    expect(mountFn).toHaveBeenCalledTimes(1);
    expect(unmountFn).toHaveBeenCalledTimes(0);
    expect(node.nodeState).toBe("mounted");

    node._unmount();

    expect(mountFn).toHaveBeenCalledTimes(1);
    expect(unmountFn).toHaveBeenCalledTimes(1);
    expect(node.nodeState).toBe("unmounted");

    node._unmount();

    expect(mountFn).toHaveBeenCalledTimes(1);
    expect(unmountFn).toHaveBeenCalledTimes(1);
    expect(node.nodeState).toBe("unmounted");

    node._mount();

    expect(mountFn).toHaveBeenCalledTimes(2);
    expect(unmountFn).toHaveBeenCalledTimes(1);
    expect(node.nodeState).toBe("mounted");

    node.destroy();

    expect(mountFn).toHaveBeenCalledTimes(2);
    expect(unmountFn).toHaveBeenCalledTimes(2);
    expect(node.nodeState).toBe("unmounted");
  });

  it("should setup event parameters", () => {
    const onTest = jest.fn();
    const node = new TestEventNode({ onTest, testValue: "test0" });

    expect(onTest).toHaveBeenCalledTimes(0);

    node.onTest.emit("test");

    expect(onTest).toHaveBeenCalledTimes(1);
    expect(onTest).toHaveBeenCalledWith("test");

    expect(node.testValue.value).toBe("test0");
  });
});
