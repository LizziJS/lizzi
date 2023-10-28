import { zz } from "@lizzi/core";
import { Else, If, zzNode } from ".";

type Props = {
  onMount: () => void;
  onUnmount: () => void;
};

class TestNode extends zzNode {
  constructor(props: Props) {
    super();

    this.onMount(() => {
      props.onMount();

      this.onceUnmount(() => {
        props.onUnmount();
      });
    });
  }
}

describe("zzNode", () => {
  it("should create If Else", () => {
    const mount = jest.fn();
    const unmount = jest.fn();
    const mountElse = jest.fn();
    const unmountElse = jest.fn();

    const node = (
      <If condition={true}>
        <TestNode onMount={mount} onUnmount={unmount} />
        <Else>
          <TestNode onMount={mountElse} onUnmount={unmountElse} />
        </Else>
      </If>
    );

    expect(node).toBeInstanceOf(If);
    expect(node).toBeInstanceOf(zzNode);

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    node._mount();

    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);
  });

  it("should create If Else", () => {
    const mount = jest.fn();
    const unmount = jest.fn();
    const mountElse = jest.fn();
    const unmountElse = jest.fn();

    const node = (
      <If condition={false}>
        <TestNode onMount={mount} onUnmount={unmount} />
        <Else>
          <TestNode onMount={mountElse} onUnmount={unmountElse} />
        </Else>
      </If>
    );

    expect(node).toBeInstanceOf(If);
    expect(node).toBeInstanceOf(zzNode);

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    node._mount();

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(1);
    expect(unmountElse).toHaveBeenCalledTimes(0);
  });

  it("should create If Else", () => {
    const mount = jest.fn();
    const unmount = jest.fn();
    const mountElse = jest.fn();
    const unmountElse = jest.fn();

    const isTrue = zz.Boolean(true);

    const node = (
      <If condition={isTrue}>
        <TestNode onMount={mount} onUnmount={unmount} />
        <Else>
          <TestNode onMount={mountElse} onUnmount={unmountElse} />
        </Else>
      </If>
    );

    expect(node).toBeInstanceOf(If);
    expect(node).toBeInstanceOf(zzNode);

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    node._mount();

    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    isTrue.value = false;

    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mountElse).toHaveBeenCalledTimes(1);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    isTrue.value = true;

    expect(mount).toHaveBeenCalledTimes(2);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mountElse).toHaveBeenCalledTimes(1);
    expect(unmountElse).toHaveBeenCalledTimes(1);
  });

  it("should create If Else", () => {
    const mount = jest.fn();
    const unmount = jest.fn();
    const mountElse = jest.fn();
    const unmountElse = jest.fn();

    const isTrue = zz.Boolean(false);

    const node = (
      <If condition={() => isTrue.value}>
        <TestNode onMount={mount} onUnmount={unmount} />
        <Else>
          <TestNode onMount={mountElse} onUnmount={unmountElse} />
        </Else>
      </If>
    );

    expect(node).toBeInstanceOf(If);
    expect(node).toBeInstanceOf(zzNode);

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(0);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    node._mount();

    expect(mount).toHaveBeenCalledTimes(0);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(1);
    expect(unmountElse).toHaveBeenCalledTimes(0);

    isTrue.value = true;

    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(0);
    expect(mountElse).toHaveBeenCalledTimes(1);
    expect(unmountElse).toHaveBeenCalledTimes(1);

    isTrue.value = false;

    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mountElse).toHaveBeenCalledTimes(2);
    expect(unmountElse).toHaveBeenCalledTimes(1);
  });
});
