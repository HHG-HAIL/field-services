import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  return (
    <div
      className={`surface-card rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-slate-950/30 transition-all duration-300 ${getPaddingStyles()} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
