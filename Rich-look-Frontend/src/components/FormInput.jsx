import React from 'react';

const FormInput = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    success,
    disabled = false,
    required = false,
    className = '',
    floating = true,
    ...props
}) => {
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = 'rl-form-input';
    const errorClass = error ? 'border-danger' : '';
    const successClass = success ? 'border-success' : '';
    const disabledClass = disabled ? 'disabled' : '';
    
    const inputClasses = [
        baseClasses,
        errorClass,
        successClass,
        disabledClass,
        className
    ].filter(Boolean).join(' ');
    
    if (floating) {
        return (
            <div className="rl-form-floating">
                <input
                    id={inputId}
                    type={type}
                    className={inputClasses}
                    placeholder={placeholder || ' '}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
                <label htmlFor={inputId} className="rl-form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
                {error && (
                    <div className="rl-text-sm text-danger mt-1">{error}</div>
                )}
                {success && (
                    <div className="rl-text-sm text-success mt-1">{success}</div>
                )}
            </div>
        );
    }
    
    return (
        <div className="rl-form-group">
            <label htmlFor={inputId} className="rl-form-label">
                {label}
                {required && <span className="text-danger ms-1">*</span>}
            </label>
            <input
                id={inputId}
                type={type}
                className={inputClasses}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                {...props}
            />
            {error && (
                <div className="rl-text-sm text-danger mt-1">{error}</div>
            )}
            {success && (
                <div className="rl-text-sm text-success mt-1">{success}</div>
            )}
        </div>
    );
};

export default FormInput;
