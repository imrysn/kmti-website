import React from "react";
import "./Button.css";

interface ButtonProps {
  // The text label to display on the button
  children: React.ReactNode;
  // The style variant: style1, style2, or style3
  variant: "style1" | "style2" | "style3";
  // Optional click handler function
  onClick?: () => void;
  // Optional button type (button, submit, or reset)
  type?: "button" | "submit" | "reset";
  // Optional disabled state
  disabled?: boolean;
  // Optional custom width
  width?: string | number;
  // Optional custom height
  height?: string | number;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  onClick,
  type = "button",
  disabled = false,
  width,
  height,
}) => {
  const style: React.CSSProperties = {};

  if (width !== undefined) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }

  if (height !== undefined) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;

