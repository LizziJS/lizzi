import { IReadOnlyReactive, zz } from "@lizzi/core";
import { If } from "@lizzi/node";
import { JSX, onInput, zzHtmlComponent } from "@lizzi/template";

type Props = {
  label: string;
  input: InputValue;
} & JSX.IntrinsicElements["input"];

export class InputComponent extends zzHtmlComponent {
  readonly input: InputValue;

  clearErrors() {
    this.input.clearErrors();
  }

  validate() {
    return this.input.validate();
  }

  constructor({ label, input, id = "", ...args }: Props) {
    super();

    this.input = input;

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
            this.input.input.value = ev.target.value;
          }}
          value={this.input}
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <If condition={input.errorMessage}>
          <div class="text-red-700 px-2 py-2 rounded-md text-sm">
            {input.errorMessage}
          </div>
        </If>
      </div>
    );
  }
}

export class InputValue implements IReadOnlyReactive<string> {
  protected readonly validators: {
    message: string;
    validator: (value: string) => boolean;
  }[] = [];

  protected readonly _errorMessage = zz.String();
  readonly errorMessage = this._errorMessage.readonly();
  readonly input = zz.String();

  readonly onChange = this.input.onChange;

  get value() {
    return this.input.value;
  }

  error(message: string) {
    this._errorMessage.value = message;
  }

  clearErrors() {
    this._errorMessage.value = "";
  }

  addValidator(fn: (value: any) => boolean, message: string): this {
    this.validators.push({
      message,
      validator: fn,
    });
    return this;
  }

  validate() {
    try {
      const findError = this.validators.find(
        ({ validator }) => !validator(this.input.value)
      );

      if (findError) {
        throw new TypeError(findError.message);
      }

      return true;
    } catch (e: any) {
      this._errorMessage.value = e.message;
    }
    return false;
  }
}
