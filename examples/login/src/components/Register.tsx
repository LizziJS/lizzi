import { JSX, zzHtmlComponent } from "@lizzi/template";
import { FormPages } from "../lib/pages/pages";
import { FormPage } from "../lib/pages/page";
import { RegisterEmailForm } from "./RegisterEmailForm";
import { zz } from "@lizzi/core";

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
              RegisterEmailForm.initializer(email, password),
              RegisterEmailForm.submit((form) => {
                email.value = form.email.value;
                password.value = form.password.value;
              }),
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
