'use client';
import { IsomorphicStorage, useIsomorphicStorage } from "@/modules/isomorphic-storage";
import { SettingsInput } from "./settings-input";
import { Type } from "arktype";

interface SettingsGroupProps {
  title: string;
  storage: IsomorphicStorage<Type<any>, boolean>;
}

export function SettingsGroup({ title, storage }: SettingsGroupProps) {
  const state = useIsomorphicStorage(storage);

  return (
    <form className="flex flex-col flex-1 p-4 space-y-4 border rounded-sm min-w-[350px] border-dark-700">
      <h2 className="text-lg font-medium">{title}</h2>
      {Object.keys(storage.def).map((key) => (
        <SettingsInput
          key={key}
          label={key}
          value={state[key]}
          onChange={(event) => {
            storage.set({
              ...state,
              [key]: event.target.value
            });
          }}
        />
      ))}
    </form>
  )
}