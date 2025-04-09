// src/components/ui/tabs.jsx
import React, { useState } from 'react';

export const Tabs = ({ children, value, onValueChange, className }) => {
  const [activeTab, setActiveTab] = useState(value);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onValueChange(tab);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isActive: child.props.value === activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

export const TabsList = ({ children }) => <div className="flex">{children}</div>;

export const TabsTrigger = ({ children, value, isActive, onTabChange }) => (
  <div
    className={`px-4 py-2 cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    onClick={() => onTabChange(value)}
  >
    {children}
  </div>
);

export const TabsContent = ({ children, value, isActive }) => {
  return isActive ? <div>{children}</div> : null;
};
