import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card = ({ children, title, className }: CardProps) => {
  return (
    <div className={`glass rounded-2xl p-6 shadow-2xl ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-6 text-white/90">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
