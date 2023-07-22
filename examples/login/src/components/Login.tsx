import { zzHtmlComponent } from "@lizzi/template";
import { InputComponent, InputValue } from "./Input";
import { Form } from "./Form";
import {
  emailValidator,
  minStringLengthValidator,
  notEmptyValidator,
} from "@lizzi/core/src/Validators";
import { checkEmail } from "../backend/emails";
import { zz } from "@lizzi/core";

export class Login extends zzHtmlComponent {
  constructor() {
    super();

    const email = new InputValue()
      .addValidator(notEmptyValidator, "Email is required")
      .addValidator(emailValidator, "Should be valid email");

    const password = new InputValue()
      .addValidator(notEmptyValidator, "Password is required")
      .addValidator(
        minStringLengthValidator(6),
        "Should be at least 6 characters"
      )
      .addValidator(
        (value) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/.test(value),
        "Password should contain atleast one number and one special character"
      );

    this.append(
      <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500">
        <div class="w-80 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-semibold mb-4">Welcome Back!</h2>
          <Form
            onSubmit={async () => {
              const check = await checkEmail(email.value);

              if (!check) {
                email.error("Email is already exists");
                return;
              }

              console.log(email.value, password.value);
            }}
          >
            {(form) => (
              <>
                <InputComponent
                  name="email"
                  placeholder="Enter your email"
                  label="Email"
                  input={email}
                />
                <InputComponent
                  name="password"
                  placeholder="Enter your password"
                  label="Password"
                  input={password}
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
