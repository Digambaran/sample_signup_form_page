import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import ClosedEye from "../closedeye";
import OpenEye from "../openeye";
import classnames from "classnames";
import GreenTick from "../greenTick";
import ErrorCross from "../cross";
import { useForm, FormProvider, useFormContext, useWatch } from "react-hook-form";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

const usernameAvailabilityApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/username_verify`;
const signupSubmitApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/sample_shield_signup_fn`;
const otpVerifyPageLocation = `${process.env.BLOCK_ENV_URL_ || "http://localhost:4010"}`;

const SignupForm = () => {
  let timeout = null;

  const [errors, setErrors] = useState({ email: false });
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState({});

  const fieldStyles = classnames(
    "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
    {
      "border-light-gray": !errors.email,
      "focus:border-primary": !errors.email,
    },
    {
      "border-error": errors.email,
      "focus:border-error": errors.email,
    }
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    debounce(setValues({ [name]: value }), 2000);
  };
  // const submit = handleSubmit(async (data) => {
  //   const _f = await fetch(signupSubmitApi, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       ...data,
  //       provider_source: "shield",
  //       acceptTerms: true,
  //     }),
  //   });
  //   const t = await _f.json();
  //   if (_f.status === 302) {
  //     window.location = `${otpVerifyPageLocation}?email=${data.email}`;
  //   }
  //   if (_f.status === 303) {
  //     setError("email", { type: "alreadySignedUp" }, { shouldFocus: true });
  //   }
  //   if (_f.status === 500) {
  //     setError("email", { type: "serverError" }, { shouldFocus: true });
  //   }
  // });
  // useEffect(() => {
  //   return () => {
  //     console.log("unoooo");
  //   };
  // });

  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form className="w-full mb-0" onSubmit={() => {}}>
        <EmailField fieldStyles={fieldStyles} />
        <UsernameField fieldStyles={fieldStyles} />
        <PasswordField fieldStyles={fieldStyles} />
        <div className="flex flex-col button-wrapper w-full mt-6">
          <TermsAndPolicy fieldStyles={fieldStyles} />
          <button
            className="w-full rounded-sm py-3 focus:outline-none mb-6 font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
            disabled={!isValid}
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
    </FormProvider>
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
const UsernameField = ({ fieldStyles }) => {
  const {
    register,
    trigger,
    formState: { isValidating, errors, isValid },
    getFieldState,
    getValues,
  } = useFormContext();
  const { username } = useWatch("username");
  const debouncedValue = useDebounce(username, 1000);
  useEffect(() => {
    debouncedValue && trigger("username");
  }, [debouncedValue]);
  console.log("username rerendered");
  return (
    <div className="mb-6">
      <label htmlFor="username" className="text-black font-almost-bold text-sm">
        Username*
      </label>
      <div className="w-full relative">
        <input
          autoComplete="off"
          placeholder="Gibinmichael"
          className={fieldStyles}
          type="text"
          id="username"
          {...register("username", {
            validate: {
              available: async (username) => {
                if (username.length < 3) return false;
                try {
                  const _j = await fetch(usernameAvailabilityApi, {
                    method: "POST",
                    body: JSON.stringify({ username }),
                  });
                  const d = await _j.json();
                  return d.available;
                } catch (err) {
                  return false;
                }
              },
            },
          })}
        />
        {getFieldState("username").isTouched && !getFieldState("username").error && (
          <div className={`absolute w-8 h-full right-1 top-6`}>
            <GreenTick />
          </div>
        )}
        {errors.username && (
          <div className={`absolute w-8 h-full right-1 top-6`}>
            <ErrorCross />
          </div>
        )}
      </div>
      {errors.username ? (
        <ErrorMsg msg="Username already in use" />
      ) : (
        getValues("username") &&
        !isValidating && <span className="text-success text-[11px] pt-2 font-medium ">Username is available</span>
      )}
    </div>
  );
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  console.log("debounce called:", debouncedValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const EmailField = ({ fieldStyles }) => {
  const emailRegx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {
    register,
    trigger,
    formState: { isValidating, errors, isValid },
  } = useFormContext();
  const { email } = useWatch("email");
  const debouncedValue = useDebounce(email, 1000);
  useEffect(() => {
    debouncedValue && trigger("email");
  }, [debouncedValue]);
  return (
    <div className="mb-6">
      <label htmlFor="email" className="text-black font-almost-bold text-sm">
        E-mail*
      </label>
      <input
        className={fieldStyles}
        placeholder="john@gmail.com"
        type="text"
        autoComplete="off"
        {...register("email", {
          validate: {
            validEmail: (value) => emailRegx.test(value),
            alreadySignedUp: (_) => {},
          },
        })}
        id="email"
      />
      {errors.email && errors.email.type === "validEmail" && <ErrorMsg msg="Invalid email" />}
      {errors.email && errors.email.type === "alreadySignedUp" && <ErrorMsg msg="Already signedup" />}
    </div>
  );
};
const PasswordField = ({ fieldStyles }) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const {
    register,
    trigger,
    formState: { isValidating, errors, isValid },
  } = useFormContext();
  const { password } = useWatch("password");
  const debouncedValue = useDebounce(password, 1000);
  useEffect(() => {
    debouncedValue && trigger("password");
  }, [debouncedValue]);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mb-6">
      <label htmlFor="password" className="text-black font-almost-bold text-sm">
        Password*
      </label>
      <div className="w-full relative">
        <input
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          id="password"
          {...register("password", {
            validate: {
              length: (value) => value.length >= 8,
              capitalLetters: (value) => /[A-Z]/.test(value),
              smallLetters: (value) => /[a-z]/.test(value),
              numbers: (value) => /[0-9]/.test(value),
              specialChars: (value) => specialChars.test(value),
            },
          })}
          className={fieldStyles}
        />
        <div
          className={`absolute w-8 h-full right-1 cursor-pointer ${showPassword ? "top-7" : "top-8"}`}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <OpenEye /> : <ClosedEye />}
        </div>
      </div>
      {errors.password && errors.password.type === "length" && <ErrorMsg msg="password needs to be atlest 8 chars" />}
      {errors.password && errors.password.type === "capitalLetters" && (
        <ErrorMsg msg="password needs to include atleast one capital letter" />
      )}
      {errors.password && errors.password.type === "smallLetters" && (
        <ErrorMsg msg="password needs to include atleast one small letter" />
      )}
      {errors.password && errors.password.type === "numbers" && (
        <ErrorMsg msg="password needs to include atleast one number" />
      )}
      {errors.password && errors.password.type === "specialChars" && (
        <ErrorMsg msg="password needs to include atleast one special char" />
      )}
    </div>
  );
};
export default SignupForm;
