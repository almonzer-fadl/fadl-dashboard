"use client";

import { useState, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "textarea" | "select" | "number" | "date";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  options,
  rows = 3,
  min,
  max,
  step,
  disabled = false,
  className = ""
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === "number" ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputId = `field-${name}`;
  const hasError = !!error;
  const isValid = !hasError && value && isFocused;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-3 py-2 border rounded-lg bg-background text-foreground
              placeholder-muted-foreground focus:outline-none transition-colors
              ${hasError 
                ? "border-destructive focus:ring-2 focus:ring-destructive/20" 
                : isValid
                ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                : "border-border focus:ring-2 focus:ring-primary"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          />
        ) : type === "select" ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-3 py-2 border rounded-lg bg-background text-foreground
              focus:outline-none transition-colors
              ${hasError 
                ? "border-destructive focus:ring-2 focus:ring-destructive/20" 
                : isValid
                ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                : "border-border focus:ring-2 focus:ring-primary"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="relative">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              id={inputId}
              name={name}
              type={type === "password" && showPassword ? "text" : type}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`
                w-full px-3 py-2 pr-10 border rounded-lg bg-background text-foreground
                placeholder-muted-foreground focus:outline-none transition-colors
                ${hasError 
                  ? "border-destructive focus:ring-2 focus:ring-destructive/20" 
                  : isValid
                  ? "border-green-500 focus:ring-2 focus:ring-green-500/20"
                  : "border-border focus:ring-2 focus:ring-primary"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
            />
            
            {/* Password visibility toggle */}
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/60 rounded transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            
            {/* Validation icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {isValid && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <p id={`${inputId}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${inputId}-help`} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className = "" }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
}

// Validation utilities
export const validators = {
  required: (value: string | number) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required";
    }
    return null;
  },
  
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },
  
  min: (min: number) => (value: number) => {
    if (value < min) {
      return `Must be at least ${min}`;
    }
    return null;
  },
  
  max: (max: number) => (value: number) => {
    if (value > max) {
      return `Must be no more than ${max}`;
    }
    return null;
  },
  
  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  }
};
