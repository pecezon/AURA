import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle } from "lucide-react";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        // shadcn Input acepta className para el estado de error
        className={
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="text-xs text-destructive flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
