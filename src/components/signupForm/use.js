import React, { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks";

export default function useform() {
  console.log("reredenre");
  const fieldValidations = {};
  const fieldRefs = {
    email: useRef(),
    username: useRef(),
    password: useRef(),
  };

  const [formState, setFormState] = useState({
    isValid: false,
    isValidating: false,
    errors: {},
  });
  const [fields, setFields] = useState({ email: { value: "" }, password: { value: "" } });
  const v = useDebounce(fieldRefs.email.current, "email", fields.email.value, 1000);
  const { timeoutId: p } = useDebounce(fieldRefs.password.current, "password", fields.password.value, 6000);
  const { timeoutId: u } = useDebounce(fieldRefs.username.current, "username", fields.password.value, 4000);
  console.log(v, u, p);
  useEffect(() => {
    console.log(`p:${p}`);
  }, [p]);
  useEffect(() => {
    console.log(`u:${u}`);
  }, [p]);
  //   useEffect(() => {
  //     console.log(`e:${e}`);
  //   }, [u]);

  useEffect(() => {
    return () => {
      //   clearTimeout(e);
      clearTimeout(p);
      clearTimeout(u);
    };
  });
  const onChange = (e) => {
    // console.log(e.target.value);
    // console.log(fields);
    const { name, value } = e.target;
    setFields((c) => ({
      ...c,
      [name]: {
        value,
        isTouched: true,
        error: false,
      },
    }));
  };
  const register = (name, validations) => {
    fieldValidations[name] = validations;
    return {
      name,
      onChange,
    };
  };
  const getValues = (name) => {
    return {
      name,
    };
  };
  const handleSubmit = (name) => {
    return {
      name,
    };
  };
  const setError = (name) => {
    return {
      name,
    };
  };
  const getFieldState = (name) => {
    return {
      name,
    };
  };

  return {
    register,
  };
}
