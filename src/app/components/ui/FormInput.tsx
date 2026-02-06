import { forwardRef, InputHTMLAttributes } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

type InputType = 'text' | 'email';
type InputSize = 'medium' | 'large';
type InputState = 'default' | 'focused' | 'filled' | 'error';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType?: InputType;
  inputSize?: InputSize;
  error?: string;
  isValid?: boolean;
  showValidation?: boolean;
  label?: string;
  labelId?: string;
}

const sizeStyles = {
  medium: 'h-12 px-4 text-base',
  large: 'h-14 px-5 text-lg'
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    inputType = 'text', 
    inputSize = 'medium', 
    error, 
    isValid,
    showValidation = false,
    label,
    labelId,
    id,
    className = '',
    ...props 
  }, ref) => {
    const sizeClass = sizeStyles[inputSize];
    const hasError = !!error;
    const inputId = id || labelId || `input-${Math.random().toString(36).substr(2, 9)}`;
    const ariaDescribedBy = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
          >
            {label}
            {props.required && <span className="text-[var(--color-accent-red)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-label={label || props['aria-label']}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError}
            className={`
              w-full ${sizeClass}
              bg-[var(--color-background-panel)]
              border-2
              ${hasError 
                ? 'border-[var(--color-border-error)] focus:border-[var(--color-accent-red)]' 
                : 'border-[var(--color-border-default)] focus:border-[var(--color-border-gold)]'
              }
              rounded-lg
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-muted)]
              outline-none
              transition-all duration-[var(--transition-normal)]
              focus:shadow-[0_0_0_4px_var(--color-glow-gold)]
              ${hasError && 'focus:shadow-[0_0_0_4px_rgba(192,57,43,0.2)]'}
              disabled:opacity-50 disabled:cursor-not-allowed
              pr-12
              ${className}
            `}
            {...props}
          />
          
          {/* Validation Icons */}
          {showValidation && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {hasError ? (
                <AlertCircle className="w-5 h-5 text-[var(--color-accent-red)]" />
              ) : isValid ? (
                <CheckCircle className="w-5 h-5 text-[var(--color-primary-gold)]" />
              ) : null}
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-2 text-sm text-[var(--color-accent-red)] flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
