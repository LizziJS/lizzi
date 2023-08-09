import { on, JSX, zzHtmlComponent } from "@lizzi/template";
import { Input } from "./Input";
import { zz } from "@lizzi/core";
import { UseNode } from "@lizzi/node";

type Props = JSX.PropsWithChildrenFunction<
  Form,
  {
    use?: UseNode<Form>;
    onSubmit?: (ev: SubmitEvent) => Promise<void>;
  }
> &
  JSX.IntrinsicElements["form"];

export class Form extends zzHtmlComponent {
  static readonly Input = Input;

  readonly isSubmitting = zz.Boolean(false);
  readonly onSubmit = zz.Event<(ev: SubmitEvent) => void>();

  constructor({ children, use, onSubmit, ...args }: Props) {
    super({ use });

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
              const inputsIterator = this.findChildNodes<Input>(
                (node) => node instanceof Input
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
                await this.onSubmit.emit(ev);
              }
            } finally {
              this.isSubmitting.value = false;
            }
          }),
        ]}
      >
        {this.callChildren(children)}
      </form>
    );
  }
}
