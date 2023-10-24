import { zz } from "@lizzi/core";
import { Router } from "@lizzi/router";
import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPage } from "./page";

export class FormPages extends zzHtmlComponent {
  readonly onSubmit = zz.Event<(view: this) => void>();

  readonly formPage = zz.Object<FormPage>(null).itemListener(
    (page) => {
      page.isActive.value = true;
    },
    (page) => {
      page.isActive.value = false;
    }
  );

  get router() {
    const router = this.firstParent(Router);
    if (!router) throw new Error("Home must be inside Router");
    return router;
  }

  get pages() {
    return [
      ...this.findChildNodes<FormPage>((node) => node instanceof FormPage),
    ];
  }

  next(page: FormPage) {
    const pages = this.pages;
    const index = pages.indexOf(page);

    if (index + 1 >= pages.length) {
      this.onSubmit.emit(this);
      return;
    }

    this.router.url.pushState({ formPage: index + 1 });
  }

  constructor({
    children,
    onSubmit,
  }: JSX.PropsWithChildren<{ onSubmit: (ev: SubmitEvent) => void }>) {
    super();

    this.initProps({ onSubmit });

    this.addToMount(() => {
      const urlRouter = this.router.url;

      const counter = urlRouter.getState("formPage");

      zz.Compute(() => {
        if (counter.value === null) {
          urlRouter.setState({ formPage: 0 });
        }
      });

      zz.Compute(() => {
        this.formPage.value = this.pages[counter.value] ?? null;
      });

      this.append(<>{this.callChildren(children)}</>);
    });
  }
}
