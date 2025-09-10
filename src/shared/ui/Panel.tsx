import React from 'react';
import { clsx } from 'clsx';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className,
  title,
  subtitle,
}) => {
  return (
    <div className={clsx(
      'bg-card border border-border rounded-md shadow-panel p-3',
      className
    )}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-h2 text-card-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-body text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
