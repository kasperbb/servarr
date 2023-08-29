import { settings } from "@/lib/settings"
import { assertValidSettings } from "@/utils/is-valid-settings";

export default async function SonarrPage() {
  const storage = settings.sonarr.get();
  assertValidSettings(storage);

  return (
    <p>
      {JSON.stringify(storage)}
    </p>
  )
}