import { zzHtmlComponent } from "@lizzi/template";
import { InputComponent, InputValue } from "./Input";
import { Form } from "./Form";
import { checkEmail } from "../backend/emails";
import { zz } from "@lizzi/core";
import { findRouter } from "@lizzi/router";
import * as validator from "yup";

export class Register extends zzHtmlComponent {
  constructor() {
    super();

    const email = new InputValue(
      validator
        .string()
        .required("Email is required")
        .email("Should be valid email")
    );

    const password = new InputValue(
      validator
        .string()
        .required("Password is required")
        .min(6, "Should be at least 6 characters")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
          "Password should contain atleast one number and one special character"
        )
    );

    const passwordConfirm = new InputValue(
      validator
        .string()
        .required("Password is required")
        .test(
          "passwords-match",
          "Passwords must match",
          (value) => password.value === value
        )
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

              findRouter(this).go([]);
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
                <InputComponent
                  name="passwordconfirm"
                  placeholder="Confirm your password"
                  label="Confirm password"
                  input={passwordConfirm}
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
