import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import ClosedEye from "../closedeye";
import OpenEye from "../openeye";
import { useDebounce } from "../../hooks";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

function PasswordField({ pushUpValidPassword }) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const debouncedValue = useDebounce(value, 800);

  const { isValid, errors } = useMemo(() => {
    const validations = {
      length: (value) => value.length >= 8,
      capitalLetters: (value) => /[A-Z]/.test(value),
      smallLetters: (value) => /[a-z]/.test(value),
      numbers: (value) => /[0-9]/.test(value),
      specialChars: (value) => specialChars.test(value),
    };
    const result = {
      length: false,
      capitalLetters: false,
      smallLetters: false,
      numbers: false,
      specialChars: false,
    };
    for (const k in validations) {
      if (Object.hasOwnProperty.call(validations, k)) {
        const fn = validations[k];
        if (!fn(debouncedValue)) {
          return { isValid: false, errors: { [k]: true } };
        }
        result[k] = false;
      }
    }
    return { isValid: true, errors: result };
  }, [debouncedValue]);

  useEffect(() => {
    if (isValid) pushUpValidPassword(value);
  }, [isValid]);

  const fieldStyles = classnames(
    "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
    {
      "border-light-gray": !(!isValid && value),
      "focus:border-primary": !(!isValid && !value),
    },
    {
      "border-error": !isValid && value,
      "focus:border-error": !isValid && value,
    }
  );

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
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className={fieldStyles}
        />
        <div
          className={`absolute w-8 h-full right-1 cursor-pointer ${showPassword ? "top-7" : "top-8"}`}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <OpenEye /> : <ClosedEye />}
        </div>
      </div>
      {value && errors.length && <ErrorMsg msg="password needs to be atlest 8 chars" />}
      {value && errors.capitalLetters && <ErrorMsg msg="password needs to include atleast one capital letter" />}
      {value && errors.smallLetters && <ErrorMsg msg="password needs to include atleast one small letter" />}
      {value && errors.numbers && <ErrorMsg msg="password needs to include atleast one number" />}
      {value && errors.specialChars && <ErrorMsg msg="password needs to include atleast one special char" />}
    </div>
  );
}

export default React.memo(PasswordField);
