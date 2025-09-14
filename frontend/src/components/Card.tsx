import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

const Card = ({ 
  children, 
  className, 
  padding = 'md', 
  shadow = 'sm',
  hover = false,
  variant = 'default'
}: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-brutalist',
    md: 'shadow-brutalist',
    lg: 'shadow-brutalist-lg',
    none: 'shadow-none',
  };

  const variantClasses = {
    default: 'bg-mongo-50 text-brutal-black',
    primary: 'bg-mongo-500 text-brutal-black',
    secondary: 'bg-mongo-600 text-brutal-white',
    accent: 'bg-brutal-yellow text-brutal-black',
  };

  return (
    <div
      className={clsx(
        'border-4 border-brutal-border',
        paddingClasses[padding],
        shadowClasses[shadow],
        variantClasses[variant],
        hover && 'hover:shadow-brutalist-hover transition-all duration-200 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={clsx('border-b-4 border-brutal-border pb-4 mb-4', className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

const CardTitle = ({ children, className }: CardTitleProps) => (
  <h3 className={clsx('text-2xl font-bold tracking-tight uppercase', className)}>
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

const CardDescription = ({ children, className }: CardDescriptionProps) => (
  <p className={clsx('text-base font-medium', className)}>
    {children}
  </p>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className }: CardContentProps) => (
  <div className={clsx(className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={clsx('border-t-4 border-brutal-border pt-4 mt-4', className)}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
