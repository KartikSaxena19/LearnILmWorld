// src/components/FormLabel.tsx
import React from "react";

export default function FormLabel({
  children,
  required = false,
  className = ""
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium mb-1 ${className}`}>
      {children}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
  );
}
