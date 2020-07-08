import { useEffect, useRef } from "react";

const useAnimateScroll = ({ method, options }) => {
  if (!method) {
    throw new Error("You need to provide a animateScroll method");
  }

  const containerRef = useRef();

  useEffect(() => {
    if (containerRef && containerRef.current) {
      method({
        container: containerRef.current,
        ...options,
      });
    }
  }, [
    containerRef,
    method,
    options,
  ]);

  return containerRef;
};

export default useAnimateScroll;
