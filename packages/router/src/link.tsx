import { JSX } from "@lizzi/template";
import { Router, zzUrl } from ".";
import { zz, zzCompute } from "@lizzi/core";
import { zzNode } from "@lizzi/node";

type UrlArray = Array<zz.variable<string>>;

type Props = JSX.IntrinsicElements["a"] &
  JSX.PropsWithChildren<{
    to?: UrlArray;
    search?: Record<
      string,
      zz.variable<string> | zz.variable<number> | zz.variable<boolean>
    >;
  }>;

export class Link extends zzNode<Props> {
  onMount({ children, to, search, href, onClick = () => {}, ...args }: Props) {
    let rQuery = new Map<string, zz.Reactive<any>>();
    if (search) {
      for (const name in search) {
        rQuery.set(name, zz.toReactive(search[name] as any));
      }
    }

    const rootRouter = this.firstParent<Router>(Router);

    if (!rootRouter) throw new Error("Link must be inside a Router");

    const url = new zzUrl();

    zzCompute(() => {
      url.pathname = to ? "/" + to.join("/") : rootRouter.url.pathname;

      const searchParams = new Map(rootRouter.url.searchParams.toMap());

      rQuery.forEach((value, name) =>
        searchParams.set(name, String(value.value))
      );

      searchParams.forEach((value, name) => {
        url.searchParams.set(name, value);
      });
    });

    this.append(
      <a
        href={() => url.href}
        {...args}
        onClick={(ev: MouseEvent) => {
          ev.preventDefault();

          onClick(ev);

          rootRouter.url.go(url.pathname + url.search);
        }}
      >
        {children}
      </a>
    );
  }
}
