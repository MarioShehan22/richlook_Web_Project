import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'base', 
    className = '', 
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    ...props 
}) => {
    const baseClasses = 'rl-btn';
    
    const variantClasses = {
        primary: 'rl-btn-primary',
        secondary: 'rl-btn-secondary',
        ghost: 'rl-btn-ghost',
        danger: 'rl-btn-danger'
    };
    
    const sizeClasses = {
        sm: 'rl-btn-sm',
        base: '',
        lg: 'rl-btn-lg'
    };
    
    const loadingClass = loading ? 'rl-btn-loading' : '';
    
    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loadingClass,
        className
    ].filter(Boolean).join(' ');
    
    const isDisabled = disabled || loading;
    
    return (
        <button 
            className={classes}
            disabled={isDisabled}
            {...props}
        >
            {icon && iconPosition === 'left' && !loading && (
                <span className="rl-btn-icon-left">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && !loading && (
                <span className="rl-btn-icon-right">{icon}</span>
            )}
        </button>
    );
};

export default Button;
