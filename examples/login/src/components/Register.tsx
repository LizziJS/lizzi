import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPages } from "../lib/pages/pages";
import { FormPage } from "../lib/pages/page";
import { RegisterEmailForm } from "./RegisterEmailForm";
import { zz } from "@lizzi/core";
import { ref } from "@lizzi/node";

class EmptyForm extends zzHtmlComponent {
  constructor({ children }: JSX.PropsWithChildren) {
    super();

    this.append(
      <form
        onSubmit={(ev: SubmitEvent) => {
          ev.preventDefault();
          this.firstParent(FormPage)?.next();
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

    const email = zz.String();
    const password = zz.String();

    const nextTrigger = zz.Event<() => void>();

    this.append(
      <FormPages onSubmit={() => {}}>
        <FormPage
          use={(form) => {
            nextTrigger.addListener(() => {
              form.next();
            });
          }}
        >
          <RegisterEmailForm
            use={[
              RegisterEmailForm.connect(email, password),
              RegisterEmailForm.submit(() => {
                nextTrigger.emit();
              }),
            ]}
          />
        </FormPage>
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
