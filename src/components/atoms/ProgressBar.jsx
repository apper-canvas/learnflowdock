import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = React.forwardRef(({ 
  value = 0, 
  className,
  showLabel = true,
  ...props 
}, ref) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full progress-fill transition-all duration-500"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-600 text-right font-medium">
          {Math.round(clampedValue)}% Complete
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;