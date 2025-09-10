import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-label font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'focus-ring w-full rounded-sm border border-border bg-surface-muted px-3 py-2 text-body text-text-primary placeholder-text-tertiary transition-all duration-base',
            icon && 'pl-10',
            error && 'border-danger',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-label text-danger">{error}</p>
      )}
    </div>
  );
};
