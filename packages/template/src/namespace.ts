import { zzReactive } from "@lizzi/core";
import { zzHtmlNode } from "./view";

type AllElementsTagName = HTMLElementTagNameMap &
  SVGElementTagNameMap & { [key: string]: HTMLElement };

export declare namespace JSX {
  interface Attributes<T extends keyof AllElementsTagName> {
    class?: Array<string | zzReactive<any>> | string | zzReactive<any>;
    style?: {
      [key: string]:
        | Array<string | zzReactive<any>>
        | string
        | number
        | zzReactive<any>;
    };
    use?:
      | Array<(view: zzHtmlNode<AllElementsTagName[T]>) => void>
      | ((view: zzHtmlNode<AllElementsTagName[T]>) => void);
    [key: string]: any;
  }

  type IntrinsicElements = {
    [T in keyof AllElementsTagName]: JSX.Attributes<T>;
  };
}
