// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md p-6 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => <div className="font-bold">{children}</div>;

export const CardContent = ({ children }) => <div>{children}</div>;

export const CardTitle = ({ children }) => <div className="text-xl">{children}</div>;
