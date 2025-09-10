import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'utility';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'focus-ring rounded-sm font-medium transition-all duration-base';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-panel hover:bg-primary/90 active:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 active:bg-secondary/70 disabled:text-muted-foreground',
    utility: 'bg-muted text-muted-foreground border border-border hover:bg-muted/80 active:bg-muted/70 disabled:text-muted-foreground',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-label',
    md: 'px-md py-sm text-body',
    lg: 'px-lg py-md text-h2',
  };
  
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
