'use client';

import { settings } from "@/lib/settings";
import { SettingsGroup } from "./settings-group";

export function Settings() {
  return (
    <div className="flex flex-wrap gap-4">
      <SettingsGroup
        title="Sonarr"
        storage={settings.sonarr}
      />

      <SettingsGroup
        title="Radarr"
        storage={settings.radarr}
      />
    </div>
  )
}