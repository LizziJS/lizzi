import { on, JSX, zzHtmlComponent } from "@lizzi/template";
import { InputComponent } from "./Input";
import { zz } from "@lizzi/core";
import { ComponentUse } from "@lizzi/node";

type Props = JSX.PropsWithFuncChildren<
  Form,
  {
    use?: ComponentUse<Form>;
    onSubmit?: (ev: SubmitEvent) => Promise<void>;
  }
> &
  JSX.IntrinsicElements["form"];

export class Form extends zzHtmlComponent {
  readonly isSubmitting = zz.Boolean(false);
  readonly onSubmit = zz.Event<() => void>();

  constructor({ children, use, onSubmit, ...args }: Props) {
    super({ children, use });

    this.initProps({ onSubmit });

    this.append(
      <form
        {...args}
        use={[
          on("submit", async (ev: SubmitEvent) => {
            ev.preventDefault();
            ev.stopPropagation();

            if (this.isSubmitting.value) return;

            this.isSubmitting.value = true;

            try {
              const inputsIterator = this.findChildNodes<InputComponent>(
                (node) => node instanceof InputComponent
              );

              const inputs = Array.from(inputsIterator);

              for (let input of inputs) {
                input.clearErrors();
              }

              let passValidation = true;
              for (let input of inputs) {
                passValidation = input.validate() && passValidation;
              }

              if (passValidation) {
                await this.onSubmit.emit();
              }
            } finally {
              this.isSubmitting.value = false;
            }
          }),
        ]}
      >
        {this.children}
      </form>
    );
  }
}
