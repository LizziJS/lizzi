import { zzHtmlComponent, JSX } from "@lizzi/template";
import { RouteAnchorName, convertToUrl, zzRouter } from ".";
import { zz, zzReactive, zzReadonlyArray } from "@lizzi/core";

type ReactiveUrl =
  | Array<string | zz.reactive<string>>
  | zzReadonlyArray<string | zz.reactive<string>>;

type Props = JSX.IntrinsicElements["a"] &
  JSX.PropsWithChildren<{ to: ReactiveUrl; anchor?: RouteAnchorName }>;

export class Link extends zzHtmlComponent {
  constructor({
    children,
    href,
    anchor,
    to,
    onClick = () => {},
    ...args
  }: Props) {
    super();

    const toArray = Array.isArray(to) ? new zzReadonlyArray(to) : to;
    const toComputeArray = zz.ComputeArray<string>(() =>
      toArray.value.map((v) => (zzReactive.isReactive(v) ? v.value : v))
    );
    const zzUrl = zz.Compute(() => convertToUrl(toComputeArray.value));

    this.append(
      <a
        href={zzUrl}
        {...args}
        onClick={(ev: MouseEvent) => {
          ev.preventDefault();

          onClick(ev);

          if (anchor) {
            zzRouter(this).goAnchor(anchor, toComputeArray.value);
          } else {
            zzRouter(this).go(toComputeArray.value);
          }
        }}
      >
        {children}
      </a>
    );
  }
}
