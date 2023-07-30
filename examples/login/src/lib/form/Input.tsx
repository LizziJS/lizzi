import { If } from "@lizzi/node";
import { JSX, zzHtmlComponent } from "@lizzi/template";
import { ValidatedValue } from "./validatedValue";

type Props = {
  label: string;
  value: ValidatedValue;
} & JSX.IntrinsicElements["input"];

export class Input extends zzHtmlComponent {
  static readonly Validator = ValidatedValue;
  readonly value: ValidatedValue;

  clearErrors() {
    this.value.clearErrors();
  }

  validate() {
    return this.value.validate();
  }

  constructor({
    label,
    value = new ValidatedValue(),
    id = "",
    ...args
  }: Props) {
    super();

    this.value = value;

    const uid = Math.random().toString(36).substring(2) + id;

    this.append(
      <div class="mb-4">
        <label for={uid} class="block text-gray-700 font-semibold mb-2">
          {label}:
        </label>
        <input
          id={uid}
          {...args}
          onChange={(ev: any) => {
            this.value.input.value = ev.target.value;
          }}
          value={this.value}
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <If condition={value.errorMessage}>
          <div class="text-red-700 px-2 py-2 rounded-md text-sm">
            {value.errorMessage}
          </div>
        </If>
      </div>
    );
  }
}
