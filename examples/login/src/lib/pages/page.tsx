import { zz } from "@lizzi/core";
import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPages } from "./pages";
import { UseNode, If } from "@lizzi/node";

export class FormPage extends zzHtmlComponent {
  readonly isActive = zz.Boolean(false);

  next() {
    this.firstParent(FormPages)?.next(this);
  }

  constructor({
    children,
    use,
  }: {
    children: JSX.ChildrenFunction<FormPage>;
    use?: UseNode<FormPage>;
  }) {
    super({ use });

    this.append(
      <If condition={this.isActive}>
        <>{this.callChildren(children)}</>
      </If>
    );
  }
}
