import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent",
        "transition-all duration-200",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;