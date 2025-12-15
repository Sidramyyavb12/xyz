import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export default function Button({ variant = "primary", children, ...props }: Props) {
  const base = "px-4 py-2 rounded text-sm font-medium disabled:opacity-60";
  const style = variant === "primary" ? "bg-black text-white" : "border border-slate-300";
  return <button {...props} className={`${base} ${style} ${props.className || ""}`}>{children}</button>;
}
