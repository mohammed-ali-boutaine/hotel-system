import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "social";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  disabled?: boolean;
  to?: string;
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
  icon,
  to,
  size = "medium",
}) => {
  const baseClasses =
    "inline-flex justify-center items-center border font-medium rounded-md focus:outline-none transition-colors duration-300 hover:cursor-pointer";

  const variantClasses = {
    primary:
      "border-transparent text-white bg-[var(--primary-color)] hover:opacity-75",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
    social: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`;

  // If to prop exists, render as Link, otherwise as button
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
        {icon && <span className="ml-2">{icon}</span>}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
