import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "dark" | "danger";

const variants: Record<Variant, string> = {
  primary: "border-forest bg-forest text-white hover:bg-[#214f3f]",
  secondary: "border-line bg-paper text-forest hover:border-teal",
  dark: "border-teal bg-navy text-cyan hover:bg-[#102c3b]",
  danger: "border-coral bg-coral text-white hover:bg-[#bf4d49]",
};

export function ActionButton({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
