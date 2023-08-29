import { settings } from "@/lib/settings"
import { assertValidSettings } from "@/utils/is-valid-settings";

export default async function RadarrPage() {
  const storage = settings.radarr.get();
  assertValidSettings(storage);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      {JSON.stringify(storage)}
    </div>
  )
}