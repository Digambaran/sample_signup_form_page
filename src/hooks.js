import React, { useState, useEffect } from "react";

// export default function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       console.log("CLEARING");
//       clearTimeout(handler);
//     };
//   }, [value]);

//   return debouncedValue;
// }

export default function useAsyncValidate(name, validations, value) {
  const controller = useRef();
  const res = useRef();
  const timedout = useRef(false);
  const attempt = useRef(0);
  const error = useRef();
  const hasMore = useRef(true);
  const suspenseStatus = useRef("pending");
  const suspender = useRef();
  const mounted = useRef(false);
  useEffect(() => {}, value);
}
