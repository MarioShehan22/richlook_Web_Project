import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const Alert = ({ 
    type = 'info', 
    title, 
    message, 
    dismissible = true, 
    autoDismiss = false, 
    dismissTime = 5000,
    onDismiss,
    className = '',
    show = true,
    ...props 
}) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    useEffect(() => {
        if (autoDismiss && isVisible) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, dismissTime);

            return () => clearTimeout(timer);
        }
    }, [autoDismiss, dismissTime, isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle />;
            case 'warning':
                return <FaExclamationTriangle />;
            case 'error':
                return <FaExclamationCircle />;
            case 'info':
            default:
                return <FaInfoCircle />;
        }
    };

    const alertClasses = [
        'rl-alert',
        `rl-alert-${type}`,
        className
    ].filter(Boolean).join(' ');

    if (!isVisible) return null;

    return (
        <div className={alertClasses} {...props}>
            <div className="d-flex align-items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {getIcon()}
                </div>
                
                <div className="flex-grow-1">
                    {title && (
                        <h6 className="mb-1 fw-semibold">{title}</h6>
                    )}
                    {message && (
                        <div className="mb-0">{message}</div>
                    )}
                </div>
                
                {dismissible && (
                    <button
                        type="button"
                        className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost flex-shrink-0"
                        onClick={handleDismiss}
                        aria-label="Dismiss alert"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
};

// Toast Container
export const ToastContainer = ({ children, position = 'top-right', className = '' }) => {
    const positionClasses = {
        'top-right': 'position-fixed top-0 end-0 p-3',
        'top-left': 'position-fixed top-0 start-0 p-3',
        'bottom-right': 'position-fixed bottom-0 end-0 p-3',
        'bottom-left': 'position-fixed bottom-0 start-0 p-3',
        'top-center': 'position-fixed top-0 start-50 translate-middle-x p-3',
        'bottom-center': 'position-fixed bottom-0 start-50 translate-middle-x p-3'
    };

    return (
        <div className={`${positionClasses[position]} ${className}`} style={{ zIndex: 1080 }}>
            <div className="d-flex flex-column gap-2" style={{ maxWidth: '400px' }}>
                {children}
            </div>
        </div>
    );
};

// Toast Component
export const Toast = ({ 
    type = 'info', 
    title, 
    message, 
    duration = 5000,
    onDismiss,
    ...props 
}) => {
    return (
        <Alert
            type={type}
            title={title}
            message={message}
            dismissible={true}
            autoDismiss={true}
            dismissTime={duration}
            onDismiss={onDismiss}
            className="rl-shadow-lg"
            {...props}
        />
    );
};

// Success Alert
export const SuccessAlert = (props) => <Alert type="success" {...props} />;

// Warning Alert
export const WarningAlert = (props) => <Alert type="warning" {...props} />;

// Error Alert
export const ErrorAlert = (props) => <Alert type="error" {...props} />;

// Info Alert
export const InfoAlert = (props) => <Alert type="info" {...props} />;

export default Alert;
