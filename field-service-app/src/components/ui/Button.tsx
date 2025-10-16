import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-500 text-white border-transparent shadow-md shadow-primary-500/30 dark:bg-primary-500 dark:hover:bg-primary-400';
      case 'secondary':
        return 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-white shadow-sm hover:shadow-md dark:bg-slate-900/70 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-900';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-400 text-white border-transparent shadow-md shadow-amber-500/30 dark:bg-amber-500 dark:hover:bg-amber-400';
      case 'danger':
        return 'bg-danger-600 hover:bg-danger-500 text-white border-transparent shadow-md shadow-danger-500/30 dark:bg-danger-500 dark:hover:bg-danger-400';
      default:
        return 'bg-primary-600 hover:bg-primary-500 text-white border-transparent shadow-md shadow-primary-500/30 dark:bg-primary-500 dark:hover:bg-primary-400';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
