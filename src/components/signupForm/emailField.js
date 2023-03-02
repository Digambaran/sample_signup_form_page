import React, { useState, useEffect, useMemo } from "react";
import classnames from "classnames";
import { useDebounce } from "../../hooks";

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

function EmailField({ pushUpValidEmail, emailInUse, emailIsInUse, serverError }) {
  const emailRegx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [alreadySignedUpEmailList, setAlreadySignedUpEmailList] = useState([]);
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 1000);

  if (emailIsInUse && !alreadySignedUpEmailList.includes(emailInUse)) {
    console.log("setting already signed up email");
    setAlreadySignedUpEmailList((s) => [...s, emailInUse]);
  }

  const isValid = useMemo(() => !!emailRegx.test(debouncedValue), [debouncedValue]);

  const isInAlreadySingnedUpList = useMemo(
    () => isValid && alreadySignedUpEmailList.includes(debouncedValue),
    [isValid]
  );

  useEffect(() => {
    if (isValid && !isInAlreadySingnedUpList) pushUpValidEmail(value);
  }, [isValid]);

  const fieldStyles = classnames(
    "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
    {
      "border-light-gray": isValid || !debouncedValue,
      "focus:border-primary": isValid || !debouncedValue,
    },
    {
      "border-error": debouncedValue && !isValid,
      "focus:border-error": debouncedValue && !isValid,
    }
  );

  return (
    <div className="mb-6">
      <label htmlFor="email" className="text-black font-almost-bold text-sm">
        E-mail*
      </label>
      <input
        className={fieldStyles}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="john@gmail.com"
        type="text"
        value={value}
        autoComplete="off"
        id="email"
      />
      {debouncedValue && !isValid && <ErrorMsg msg="Invalid email" />}
      {debouncedValue && isInAlreadySingnedUpList && <ErrorMsg msg="Already signedup" />}
    </div>
  );
}

export default React.memo(EmailField);
