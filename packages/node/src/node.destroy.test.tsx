import { DestructorsStack, SilentDestructorsStack, zzArray } from "@lizzi/core";
import { zzNode } from "./node";
import { JSX } from "@lizzi/jsx-runtime";
import { ArrayView } from "./ArrayView";

class TestNode extends zzNode {
  constructor({
    use,
    children,
  }: {
    use?: (view: TestNode) => void;
    children: JSX.Children;
  }) {
    super();

    this.configUseProp(use);

    this.onMount(() => {
      this.append(children);
    });
  }
}

class TestMountNode extends zzNode {
  constructor({
    fn1,
    fn2,
    fn3,
    fn4,
  }: {
    fn1: () => void;
    fn2: () => void;
    fn3: () => void;
    fn4: () => void;
  }) {
    super();

    this.onMount(() => {
      this.append(
        <>
          <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
          <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
          <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
        </>
      );
    });
  }
}

class TestDestroyNode extends zzNode {
  readonly testDestroy = new DestructorsStack();

  private fn1: () => void;

  destroy(): void {
    super.destroy();

    this.fn1();
  }

  constructor({
    fn1,
    fn2,
    fn3,
    fn4,
  }: {
    fn1: () => void;
    fn2: () => void;
    fn3: () => void;
    fn4: () => void;
  }) {
    super();

    this.fn1 = fn1;

    this.testDestroy.addFunc(() => {
      fn2();
    });

    new DestructorsStack().addFunc(() => {
      fn3();
    });

    this.onMount(() => {
      new DestructorsStack().addFunc(() => {
        fn4();
      });
    });
  }
}

class TestDestroySilentNode extends zzNode {
  readonly testDestroy = new SilentDestructorsStack(true);

  private fn1: () => void;

  destroy(): void {
    super.destroy();

    this.fn1();
  }

  constructor({
    fn1,
    fn2,
    fn3,
    fn4,
  }: {
    fn1: () => void;
    fn2: () => void;
    fn3: () => void;
    fn4: () => void;
  }) {
    super();

    this.fn1 = fn1;

    this.testDestroy.addFunc(() => {
      fn2();
    });

    new DestructorsStack().addFunc(() => {
      fn3();
    });

    this.onMount(() => {
      new DestructorsStack().addFunc(() => {
        fn4();
      });
    });
  }
}

describe("zzNode", () => {
  it("should destroy onceUnmount", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const nodes = (
      <TestNode>
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
      </TestNode>
    );

    nodes._mount();

    nodes.childNodes.removeAll();

    expect(destroyTick).toBe(3);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    expect(fn3).toHaveBeenCalledTimes(0);
    expect(fn4).toHaveBeenCalledTimes(3);
  });

  it("should destroy onceUnmount", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const nodes = <TestMountNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />;

    nodes._mount();
    nodes._unmount();

    expect(destroyTick).toBe(12);
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn1).toHaveReturnedWith(1);
    expect(fn1).toHaveReturnedWith(5);
    expect(fn1).toHaveReturnedWith(9);

    expect(fn2).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveReturnedWith(2);
    expect(fn2).toHaveReturnedWith(6);
    expect(fn2).toHaveReturnedWith(10);

    expect(fn3).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveReturnedWith(3);
    expect(fn3).toHaveReturnedWith(7);
    expect(fn3).toHaveReturnedWith(11);

    expect(fn4).toHaveBeenCalledTimes(3);
    expect(fn4).toHaveReturnedWith(0);
    expect(fn4).toHaveReturnedWith(4);
    expect(fn4).toHaveReturnedWith(8);
  });

  it("should destroy onceUnmount", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const nodes = (
      <TestNode>
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
        <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
      </TestNode>
    );

    nodes._mount();
    nodes._unmount();

    expect(destroyTick).toBe(3);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    expect(fn3).toHaveBeenCalledTimes(0);
    expect(fn4).toHaveBeenCalledTimes(3);
  });

  it("should destroy array", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const array = new zzArray([
      <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />,
      <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />,
      <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />,
    ]);

    const nodes = (
      <TestNode>
        <ArrayView>{array}</ArrayView>
      </TestNode>
    );

    nodes._mount();

    array.removeAll();

    expect(destroyTick).toBe(3);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);
    expect(fn3).toHaveBeenCalledTimes(0);
    expect(fn4).toHaveBeenCalledTimes(3);
  });

  it("should destroy map", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const array = new zzArray([1, 2, 3]);

    const nodes = (
      <TestNode>
        <ArrayView>
          {array.map(() => (
            <TestDestroyNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
          ))}
        </ArrayView>
      </TestNode>
    );

    nodes._mount();

    array.removeAll();

    expect(destroyTick).toBe(12);
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn1).toHaveReturnedWith(1);
    expect(fn1).toHaveReturnedWith(5);
    expect(fn1).toHaveReturnedWith(9);

    expect(fn2).toHaveBeenCalledTimes(3);
    expect(fn2).toHaveReturnedWith(2);
    expect(fn2).toHaveReturnedWith(6);
    expect(fn2).toHaveReturnedWith(10);

    expect(fn3).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveReturnedWith(3);
    expect(fn3).toHaveReturnedWith(7);
    expect(fn3).toHaveReturnedWith(11);

    expect(fn4).toHaveBeenCalledTimes(3);
    expect(fn4).toHaveReturnedWith(0);
    expect(fn4).toHaveReturnedWith(4);
    expect(fn4).toHaveReturnedWith(8);
  });

  it("should destroy map w/o silent destructor", () => {
    let destroyTick = 0;

    const fn1 = jest.fn(() => destroyTick++);
    const fn2 = jest.fn(() => destroyTick++);
    const fn3 = jest.fn(() => destroyTick++);
    const fn4 = jest.fn(() => destroyTick++);

    const array = new zzArray([1, 2, 3]);

    const nodes = (
      <TestNode>
        <ArrayView>
          {array.map(() => (
            <TestDestroySilentNode fn1={fn1} fn2={fn2} fn3={fn3} fn4={fn4} />
          ))}
        </ArrayView>
      </TestNode>
    );

    nodes._mount();

    array.removeAll();

    expect(destroyTick).toBe(9);
    expect(fn1).toHaveBeenCalledTimes(3);
    expect(fn1).toHaveReturnedWith(1);
    expect(fn1).toHaveReturnedWith(4);
    expect(fn1).toHaveReturnedWith(7);

    expect(fn2).toHaveBeenCalledTimes(0);

    expect(fn3).toHaveBeenCalledTimes(3);
    expect(fn3).toHaveReturnedWith(2);
    expect(fn3).toHaveReturnedWith(5);
    expect(fn3).toHaveReturnedWith(8);

    expect(fn4).toHaveBeenCalledTimes(3);
    expect(fn4).toHaveReturnedWith(0);
    expect(fn4).toHaveReturnedWith(3);
    expect(fn4).toHaveReturnedWith(6);
  });
});
