import { Settings } from "./settings";

export default async function SettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <Settings />
    </div>
  )
}