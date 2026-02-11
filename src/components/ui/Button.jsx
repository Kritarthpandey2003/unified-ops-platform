import React from 'react';
import classNames from 'classnames';

export const Button = ({
    children,
    variant = 'primary', // primary | secondary | outline | ghost | danger
    size = 'md', // sm | md | lg
    className,
    disabled,
    isLoading,
    ...props
}) => {

    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[hsl(222,47%,20%)] focus:ring-[var(--color-primary)]",
        secondary: "bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-base)] focus:ring-[var(--color-border)]",
        outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[hsl(222,47%,95%)]",
        ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)] hover:text-[var(--color-text-primary)]",
        danger: "bg-[var(--color-danger)] text-white hover:opacity-90 focus:ring-[var(--color-danger)]",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 py-2 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-lg",
    };

    // Note: Using inline styles for variables if Tailwind isn't fully configured to read them, 
    // but here I'm using arbitrary values [] which Tailwind supports via JIT.
    // Since I haven't fully configured Tailwind config for these variables, I'll rely on the global CSS classes + style attribute if needed.
    // Actually, for simplicity in this hybrid setup, I'll use style objects for colors if Tailwind classes fail, 
    // OR I will simply use standard CSS classes. 

    // Let's use standard CSS classes defined in global.css to be safe, or just utility classes I defined.
    // But wait, I set up `global.css` with `.btn-primary` etc? No, I defined generic ones.
    // Let's stick to inline styles for the specific colors to ensure it works 100% without TAlwind config debugging.

    return (
        <button
            className={classNames(baseStyles, className)}
            style={{
                backgroundColor: variant === 'primary' ? 'var(--color-primary)' :
                    variant === 'danger' ? 'var(--color-danger)' :
                        variant === 'secondary' ? 'white' : 'transparent',
                color: variant === 'primary' || variant === 'danger' ? 'white' : 'var(--color-text-primary)',
                border: variant === 'secondary' || variant === 'outline' ? '1px solid var(--color-border)' : 'none',
                ...props.style
            }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
};
