import { zzFloat, zzInteger } from "@lizzi/core";
import { EventWrapper, zzEvent } from "@lizzi/core/Event";
import { DomElementView } from "@lizzi/template";

export function zzScrollElement() {
  const top = new zzFloat(0);
  const bottom = new zzFloat(0);
  const height = new zzFloat(0);
  const onScroll = new zzEvent();

  const useScroll = (view: DomElementView<any>) => {
    view.addToUnmount(
      new EventWrapper(view.element, "scroll", () => {
        top.value = view.element.scrollTop;
        bottom.value = view.element.scrollTop + view.element.clientHeight;
        height.value = view.element.scrollHeight;
        onScroll.emit();
      })
    );
  };

  return { top, bottom, height, onScroll, useScroll };
}
