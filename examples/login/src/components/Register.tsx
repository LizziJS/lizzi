import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPages } from "../lib/pages/pages";
import { FormPage } from "../lib/pages/page";
import { RegisterEmailForm } from "./RegisterEmailForm";

class EmptyForm extends zzHtmlComponent {
  constructor({ children }: JSX.PropsWithChildren) {
    super();

    this.append(
      <form
        onSubmit={(ev: SubmitEvent) => {
          ev.preventDefault();
          this.firstParent(FormPage)?.next(ev);
        }}
      >
        <div>{children}</div>
        <button>next</button>
      </form>
    );
  }
}

export class Register extends zzHtmlComponent {
  constructor() {
    super();

    this.append(
      <FormPages
        onSubmit={() => {
          const emailform = this.firstChild(RegisterEmailForm);
          if (!emailform) return;
        }}
      >
        <RegisterEmailForm />
        <FormPage>
          <EmptyForm>2</EmptyForm>
        </FormPage>
        <FormPage>
          <EmptyForm>3</EmptyForm>
        </FormPage>
      </FormPages>
    );
  }
}
