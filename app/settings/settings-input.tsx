'use client';
import { Input } from "@/components/ui/input";
import React, { useId } from "react";

export interface SettingsInputProps extends React.ComponentProps<typeof Input> {
  label: string;
}

export function SettingsInput({ label, ...rest }: SettingsInputProps) {
  const id = useId();

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        type="text"
        className="px-4 py-2 rounded-md"
        {...rest}
      />
    </div>
  )
}