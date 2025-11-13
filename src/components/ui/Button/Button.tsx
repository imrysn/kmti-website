import React from "react";
import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  variant: "style1" | "style2" | "style3";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  width?: string | number;
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
