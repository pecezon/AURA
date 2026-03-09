import React from "react";
import { Field, FieldLabel } from "./ui/field";
import { Progress } from "./ui/progress";

interface StatProgressBarProps {
  label: string;
  value: number;
  max: number;
}

export const StatProgressBar: React.FC<StatProgressBarProps> = ({
  label,
  value,
  max,
}) => {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor="progress-upload">
        <span>{label}</span>
        <span className="ml-auto">
          {value} / {max}
        </span>
      </FieldLabel>
      <Progress value={value} max={max} id="progress-upload" />
    </Field>
  );
};
