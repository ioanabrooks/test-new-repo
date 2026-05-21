"use client";
import React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-10 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 ${className}`}
      {...props}
    />
  );
}
