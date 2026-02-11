import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#00a2bd] text-white hover:bg-[#007a8e] border border-transparent",
    outline: "bg-transparent border border-black/10 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
    ghost: "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5",
    soft: "bg-[#00a2bd]/10 text-[#00a2bd] hover:bg-[#00a2bd]/20 border border-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-[11px]",
    lg: "px-8 py-4 text-xs",
    xl: "px-10 py-5 text-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};