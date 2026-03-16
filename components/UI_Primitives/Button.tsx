import { cn } from "@/lib/utils";

type Variant = "primary" | "yellow" | "outline" | "ghost";
type Size    = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  yellow:  "btn-yellow",
  outline: "btn-outline",
  ghost:   "btn-ghost",
};

const sizes: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
};

export default function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
