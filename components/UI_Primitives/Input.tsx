import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export default function Input({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--foreground-2)" }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "input",
          error && "border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--error)_15%,transparent)]",
          className
        )}
        {...props}
      />

      {(hint || error) && (
        <p
          style={{
            fontSize: "0.72rem",
            color: error ? "var(--error)" : "var(--foreground-4)",
          }}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
