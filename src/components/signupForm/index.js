import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useForm } from "react-hook-form";
import ClosedEye from "../closedeye";
import OpenEye from "../openeye";
import classnames from "classnames";
import GreenTick from "../greenTick";
import ErrorCross from "../cross";
import useDebounce from "../../hooks";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

const SignupForm = () => {
  const usernameAvailabilityApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/username_verify`;
  const signupSubmitApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/sample_shield_signup_fn`;
  const otpVerifyPageLocation = `${process.env.BLOCK_ENV_URL_ || "http://localhost:4010"}`;

  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const emailRegx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let timeout = null;

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState({});

  const validations = {
    email: {
      validEmail: (value) => emailRegx.test(value),
      alreadySignedUp: (_) => {},
    },
    password: {
      length: (value) => value.length >= 8,
      capitalLetters: (value) => /[A-Z]/.test(value),
      smallLetters: (value) => /[a-z]/.test(value),
      numbers: (value) => /[0-9]/.test(value),
      specialChars: (value) => specialChars.test(value),
    },

    username: {
      validate: (value) => {
        console.log("in validate");
        if (value.length < 3) return false;
        return new Promise((resolve) => {
          debounce(
            async (username) => {
              try {
                const _j = await fetch(usernameAvailabilityApi, {
                  method: "POST",
                  body: JSON.stringify({ username }),
                });
                const d = await _j.json();
                resolve(d.available);
              } catch (_err) {
                resolve(false);
              }
            },
            8000,
            { leading: true }
          )(value);
        });
      },
    },
  };

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

  const {
    setError,
    handleSubmit,
    getValues,
    getFieldState,
    formState: { isValidating },
  } = useForm({ mode: "onChange" });

  // useValidator(() => {}, [values.email]);
  // useValidator(() => {}, [values.password]);
  // useValidator(() => {}, [values.username]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    debounce(setValues({ [name]: value }), 2000);
  };

  return (
    <form
      className="w-full mb-0"
      onSubmit={handleSubmit(async (data) => {
        const _f = await fetch(signupSubmitApi, {
          method: "POST",
          body: JSON.stringify({
            ...data,
            provider_source: "shield",
            acceptTerms: true,
          }),
        });
        const t = await _f.json();
        if (_f.status === 302) {
          window.location = `${otpVerifyPageLocation}?email=${data.email}`;
        }
        if (_f.status === 303) {
          setError("email", { type: "alreadySignedUp" }, { shouldFocus: true });
        }
        if (_f.status === 500) {
          setError("email", { type: "serverError" }, { shouldFocus: true });
        }
      })}
    >
      <div className="mb-6">
        <label htmlFor="email" className="text-black font-almost-bold text-sm">
          E-mail*
        </label>
        <input
          className={fieldStyles}
          placeholder="john@gmail.com"
          type="text"
          autoComplete="off"
          name="email"
          id="email"
          onChange={handleOnChange}
        />
        {errors.email && errors.email.type === "validEmail" && <ErrorMsg msg="Invalid email" />}
        {errors.email && errors.email.type === "alreadySignedUp" && <ErrorMsg msg="Already signedup" />}
      </div>
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
            name="username"
            onChange={handleOnChange}
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
      <div className="mb-6">
        <label htmlFor="password" className="text-black font-almost-bold text-sm">
          Password*
        </label>
        <div className="w-full relative">
          <input
            autoComplete="off"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className={fieldStyles}
            onChange={handleOnChange}
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
      <div className="flex flex-col button-wrapper w-full mt-6">
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
  );
};

export default SignupForm;
