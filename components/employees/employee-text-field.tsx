import { type Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type CreateEmployeeFormValues } from "@/lib/employees/schema";

type EmployeeTextFieldProps = {
  control: Control<CreateEmployeeFormValues>;
  disabled?: boolean;
  name: Exclude<keyof CreateEmployeeFormValues, "jobDescription">;
  label: string;
  placeholder: string;
  type?: React.ComponentProps<typeof Input>["type"];
  inputMode?: React.ComponentProps<typeof Input>["inputMode"];
};

export function EmployeeTextField({
  control,
  disabled = false,
  name,
  label,
  placeholder,
  type = "text",
  inputMode,
}: EmployeeTextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              inputMode={inputMode}
              placeholder={placeholder}
              type={type}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
