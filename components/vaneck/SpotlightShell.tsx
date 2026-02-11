import * as React from "react";

interface SpotlightShellProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightShell: React.FC<SpotlightShellProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full bg-white dark:bg-[#050505] transition-colors duration-500 selection:bg-[#00a2bd] selection:text-white ${className}`}>
      {/* Abstract Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-gradient-to-bl from-[#00a2bd]/5 via-transparent to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-gradient-to-tr from-[#e76408]/3 via-transparent to-transparent blur-[100px]" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};