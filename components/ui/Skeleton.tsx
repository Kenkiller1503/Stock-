
import * as React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-black/5 dark:bg-white/5 rounded-sm ${className}`}
      style={{
        animationDuration: '1.5s',
      }}
    />
  );
};
