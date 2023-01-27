import React, { useState, useEffect, useRef } from "react";

export default function useDebounce(id, field, value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // console.log(`id:${id}`);
  // console.log(`value:${value}`);
  // console.log(`field:${field}`);
  // console.log(`delay:${delay}`);
  let timeoutId = id;
  useEffect(() => {
    console.log(`value changed`);
    id = setTimeout(() => {
      console.log("done");
    }, delay);
  }, [value]);
  useEffect(() => {
    console.log(`field change`);
  }, [field]);
  console.log("returned");
  return { id, debouncedValue };
}
