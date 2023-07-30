import { zz } from "@lizzi/core";
import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPages } from "./pages";
import { If } from "@lizzi/node";

export class FormPage extends zzHtmlComponent {
  readonly isActive = zz.Boolean(false);

  next(ev: SubmitEvent) {
    this.firstParent(FormPages)?.next(ev, this);
  }

  constructor({ children }: { children: JSX.Children<JSX.Element> }) {
    super();

    this.append(<If condition={this.isActive}>{children}</If>);
  }
}
