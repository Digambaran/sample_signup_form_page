import React, { useCallback, useEffect, useState } from "react";

import EmailField from "./emailField";
import UsernameField from "./usernameField";
import PasswordField from "./passwordField";

const signupSubmitApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/sample_shield_signup_fn`;
const otpVerifyPageLocation = `${process.env.BLOCK_ENV_URL_ || "http://localhost:4010"}`;

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false);

  const pushUpValidEmail = useCallback((validValue) => {
    setEmail(validValue);
  });
  const pushUpValidPassword = useCallback((validValue) => {
    setPassword(validValue);
  });
  const pushUpValidUsername = useCallback((validValue) => {
    setUsername(validValue);
  });

  const readyToSubmit = () => !!(email && password && username && !isSubmitting);

  const submit = async (e) => {
    e.preventDefault();
    const _f = await fetch(signupSubmitApi, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        username,
        provider_source: "shield",
        acceptTerms: true,
      }),
    });
    const t = await _f.json();
    if (_f.status === 302) {
      window.location = `${otpVerifyPageLocation}?email=${email}`;
    }
    if (_f.status === 303) {
      setEmailAlreadyInUse(true);
    }
    if (_f.status === 500) {
      setServerError(true);
    }
  };

  useEffect(() => {
    return () => {
      console.log("unoooo");
    };
  });

  console.log(readyToSubmit());

  return (
    <form className="w-full mb-0" onSubmit={submit}>
      <EmailField pushUpValidEmail={pushUpValidEmail} emailIsInUse={emailAlreadyInUse} emailInUse={email} />
      <UsernameField pushUpValidUsername={pushUpValidUsername} />
      <PasswordField pushUpValidPassword={pushUpValidPassword} />
      <div className="flex flex-col button-wrapper w-full mt-6">
        <TermsAndPolicy />
        <button
          className="w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
          disabled={!readyToSubmit()}
          type="submit"
        >
          Sign Up
        </button>
        <p className="w-full text-sm mb-6 text-grey">
          Already have an account?
          <a
            className="text-primary cursor-pointer hover:underline underline-offset-4 font-bold focus:outline-none"
            href="/auth/login"
          >
            &nbsp;Sign in
          </a>
        </p>
      </div>
    </form>
  );
};

const TermsAndPolicy = () => {
  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center max-w-full">
        <label className="float-left flex cursor-pointer items-center">
          <input className="peer hidden" type="checkbox" id="acceptTerms" />
          <span className="chkbox-icon border-ab-disabled float-left mr-2 h-5 w-5 flex-shrink-0 rounded border bg-white"></span>
        </label>
        <div className="text-grey text-xs">
          By signing up you agree to Appblocks'
          <a className="text-primary cursor-pointer hover:underline underline-offset-4 focus:outline-none" href="#">
            Terms of use{" "}
          </a>
          and{" "}
          <a className="text-primary cursor-pointer hover:underline underline-offset-4 focus:outline-none" href="#">
            privacy policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
