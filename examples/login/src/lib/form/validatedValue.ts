import { IReadOnlyReactive, zz } from "@lizzi/core";

export class ValidatedValue implements IReadOnlyReactive<string> {
  protected readonly _errorMessage = zz.String();
  readonly errorMessage = this._errorMessage.readonly();
  readonly input = zz.String();

  protected readonly _typeValidators: {
    validator: (value: any, ...args: any[]) => boolean;
    message: string;
    args: any[];
  }[] = [];

  addValidator<T extends (value: any) => boolean>(
    validator: T,
    message: string,
    ...args: T extends (value: any, ...args: infer U) => boolean ? U : never
  ) {
    this._typeValidators.push({ validator, message, args });

    return this;
  }

  validate() {
    const notValid = this._typeValidators.find(
      (fn) => !fn.validator(this.input.value, ...fn.args)
    );

    if (notValid) {
      this._errorMessage.value = notValid.message;

      return false;
    }

    return true;
  }

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
}
