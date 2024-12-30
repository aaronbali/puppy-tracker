import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="border rounded p-4 bg-white shadow-md">
      {children}
    </div>
  );
};

interface CardHeaderProps {
    children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
    return (
        <div className="pb-4">
            {children}
        </div>
    )
}

interface CardTitleProps {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
    return (
        <h2 className="text-xl font-bold">
            {children}
        </h2>
    )
}

interface CardContentProps {
    children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}
