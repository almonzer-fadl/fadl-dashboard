"use client";

import { useState, useEffect } from "react";
import { Navigation } from "../navigation";
import { MobileNav, MobileBottomNav } from "../navigation/mobile-nav";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className = "" }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Main Content */}
      <main className={`${isMobile ? 'pt-16 pb-20' : 'pb-20'}`}>
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && <MobileBottomNav />}
      
      {/* Desktop Navigation - Hidden on Mobile */}
      {!isMobile && (
        <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 transform z-50">
          <Navigation />
        </div>
      )}
    </div>
  );
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: ResponsiveGridProps) {
  const gridCols = `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;
  
  return (
    <div className={`grid gap-4 ${gridCols} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveContainer({ 
  children, 
  className = "",
  maxWidth = 'xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }[maxWidth];

  const paddingClass = {
    none: '',
    sm: 'px-2 py-4',
    md: 'px-4 py-6',
    lg: 'px-6 py-8'
  }[padding];

  return (
    <div className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Text
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  responsive?: boolean;
}

export function ResponsiveText({ 
  children, 
  className = "",
  size = 'base',
  weight = 'normal',
  responsive = true
}: ResponsiveTextProps) {
  const sizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }[size];

  const weightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[weight];

  const responsiveClass = responsive ? 'text-sm sm:text-base lg:text-lg' : '';

  return (
    <div className={`${sizeClass} ${weightClass} ${responsiveClass} ${className}`}>
      {children}
    </div>
  );
}

// Responsive Button
interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function ResponsiveButton({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  className = "",
  disabled = false,
  fullWidth = false
}: ResponsiveButtonProps) {
  const variantClass = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        ${variantClass} ${sizeClass} ${widthClass} ${className}
      `}
    >
      {children}
    </button>
  );
}

// Responsive Card
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function ResponsiveCard({ 
  children, 
  className = "",
  padding = 'md',
  shadow = 'sm',
  hover = false
}: ResponsiveCardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }[shadow];

  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div className={`
      bg-card border rounded-lg
      ${paddingClass} ${shadowClass} ${hoverClass} ${className}
    `}>
      {children}
    </div>
  );
}
