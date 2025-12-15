import React from 'react';
import './Button.css';

const Button = ({
                    children,
                    type = 'button',
                    variant = 'primary',
                    size = 'medium',
                    className = '',
                    onClick,
                    disabled = false,
                    fullWidth = false
                }) => {
    const buttonClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`;

    return (
        <button
            type={type}
            className={buttonClass}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;