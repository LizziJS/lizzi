import { zzHtmlComponent } from "@lizzi/template";
import { Form, ValidatedValue } from "../lib/form";
import { zz } from "@lizzi/core";
import validator from "validator";
import { UseNode } from "@lizzi/node";

type Props = {
  onSubmit?: (view: RegisterEmailForm) => void;
  email?: string;
  password?: string;
  use?: UseNode<RegisterEmailForm>;
};

export class RegisterEmailForm extends zzHtmlComponent {
  readonly onSubmit = zz.Event<(ev: SubmitEvent, view: this) => void>();

  readonly email;
  readonly password;
  readonly passwordConfirm;

  static connect(email: zz.String, password: zz.String) {
    return (view: RegisterEmailForm) => {
      view.email.input.value = email.value;
      view.password.input.value = password.value;
      view.passwordConfirm.input.value = password.value;

      view.onSubmit.addListener(() => {
        email.value = view.email.value;
        password.value = view.password.value;
      });
    };
  }

  static submit(onSubmit: (ev: SubmitEvent, view: RegisterEmailForm) => void) {
    return (view: RegisterEmailForm) => {
      view.onSubmit.addListener(onSubmit);
    };
  }

  constructor({ onSubmit, email = "", password = "", use }: Props) {
    super({ use });

    this.initProps({ onSubmit });

    this.email = new ValidatedValue(email)
      .addValidator((val) => !validator.isEmpty(val), "Email is required")
      .addValidator(validator.isEmail, "Email is not valid")
      .addValidator(validator.isLength, "Email is too short", { min: 3 })
      .addValidator(validator.isLength, "Email is too long", { max: 255 });

    this.password = new ValidatedValue(password)
      .addValidator((val) => !validator.isEmpty(val), "Password is required")
      .addValidator(validator.isLength, "Password is too short", { min: 8 })
      .addValidator(
        (input: string) =>
          validator.isStrongPassword(input, {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        "Password is not strong enough"
      );

    this.passwordConfirm = new ValidatedValue(password).addValidator(
      (value) => value === this.password.value,
      "Passwords do not match"
    );

    this.append(
      <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500">
        <div class="w-80 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-semibold mb-4">Welcome Back!</h2>
          <Form
            onSubmit={async (ev: SubmitEvent) => {
              this.onSubmit.emit(ev, this);
            }}
          >
            {(form) => (
              <>
                <Form.Input
                  name="email"
                  placeholder="Enter your email"
                  label="Email"
                  value={this.email}
                />
                <Form.Input
                  name="password"
                  placeholder="Enter your password"
                  label="Password"
                  value={this.password}
                />
                <Form.Input
                  name="passwordconfirm"
                  placeholder="Confirm your password"
                  label="Confirm password"
                  value={this.passwordConfirm}
                />
                <button
                  disabled={form.isSubmitting}
                  type="submit"
                  class={[
                    zz.If(
                      form.isSubmitting,
                      "cursor-not-allowed opacity-50",
                      ""
                    ),
                    "w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors",
                  ]}
                >
                  Submit
                </button>
              </>
            )}
          </Form>
        </div>
      </div>
    );
  }
}
