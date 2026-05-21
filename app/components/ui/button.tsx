"use client";
import React from "react";
import { cn } from "../../utils/css-utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "icon";
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = {
    default: "bg-white text-slate-950 hover:bg-slate-100",
    secondary: "bg-white/10 text-white hover:bg-white/15",
    ghost: "bg-transparent hover:bg-white/10",
  };
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    icon: "h-9 w-9",
  };

  return (
    <button
      type={type}
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
