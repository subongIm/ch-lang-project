import React from 'react';
import { clsx } from 'clsx';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <button
      className={clsx(
        'focus-ring rounded-pill px-2.5 py-1.5 text-label font-medium transition-all duration-base',
        selected
          ? 'bg-chip-selected-bg text-chip-selected-text border border-chip-selected-border'
          : 'bg-chip-bg text-chip-text border border-chip-border hover:bg-surface-muted hover:border-chip-border',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
