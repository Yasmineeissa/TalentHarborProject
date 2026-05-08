import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ className = "", variant = "secondary", ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`.trim()} {...props} />;
}
