import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-hover shadow-sm',
    secondary: 'bg-card text-text border border-border hover:bg-card-light',
    danger: 'bg-critical text-white hover:bg-red-600',
    ghost: 'hover:bg-card-light text-text-secondary hover:text-text'
  };

  return (
    <button 
      className={`\${baseStyles} \${variants[variant]} h-10 py-2 px-4 \${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
