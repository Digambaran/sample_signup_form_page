import React, { useEffect, useState } from "react";
import classnames from "classnames";
import GreenTick from "../greenTick";
import ErrorCross from "../cross";
import { useDebounce } from "../../hooks";

const usernameAvailabilityApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/username_verify`;
const signupSubmitApi = `${process.env.BLOCK_FUNCTION_URL || "http://localhost:5000"}/sample_shield_signup_fn`;
const otpVerifyPageLocation = `${process.env.BLOCK_ENV_URL_ || "http://localhost:4010"}`;

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

function UsernameField({ pushUpValidUsername }) {
  const [value, setValue] = useState("");
  const [availability, setAvailability] = useState({ isAvailable: false, isChecking: false });

  const debouncedValue = useDebounce(value, 1000);
  const validateFn = async (username) => {
    if (username.length < 3) {
      setAvailability({ isAvailable: false, isChecking: false });
      return;
    }
    try {
      const _j = await fetch(usernameAvailabilityApi, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      const d = await _j.json();
      if (d.available) {
        setAvailability({ isAvailable: true, isChecking: false });
      } else {
        setAvailability({ isAvailable: false, isChecking: false });
      }
    } catch (err) {
      setAvailability({ isAvailable: false, isChecking: false });
    }
  };

  useEffect(() => {
    setAvailability({ isAvailable: false, isChecking: true });
    validateFn(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (availability.isAvailable) pushUpValidUsername(debouncedValue);
  }, [availability.isAvailable]);

  const fieldStyles = classnames(
    "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
    {
      "border-light-gray": !(!availability.isAvailable && value),
      "focus:border-primary": !(!availability.isAvailable && value),
    },
    {
      "border-error": !availability.isAvailable && value,
      "focus:border-error": !availability.isAvailable && value,
    }
  );

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
          onChange={(e) => setValue(e.target.value)}
        />
        {availability.isAvailable && value && (
          <div className={`absolute w-8 h-full right-1 top-6`}>
            <GreenTick />
          </div>
        )}
        {!availability.isAvailable && value && (
          <div className={`absolute w-8 h-full right-1 top-6`}>
            <ErrorCross />
          </div>
        )}
      </div>
      {!availability.isAvailable && !availability.isChecking && value && <ErrorMsg msg="Username already in use" />}
      {availability.isAvailable && !availability.isChecking && (
        <span className="text-success text-[11px] pt-2 font-medium ">Username is available</span>
      )}
      {availability.isChecking && value && (
        <span className="text-success text-[11px] pt-2 font-medium ">validating...</span>
      )}
    </div>
  );
}

export default React.memo(UsernameField);
