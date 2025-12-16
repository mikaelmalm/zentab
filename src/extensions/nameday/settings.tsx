import { ExtensionConfig, ExtensionSettingsProps } from "../types";
import NamedayExtension from "./index";

const SettingsComponent = ({
  settings,
  onUpdateSettings,
}: ExtensionSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white/80">Enabled</label>
        <button
          onClick={() =>
            onUpdateSettings({ ...settings, enabled: !settings.enabled })
          }
          className={`w-12 h-6 rounded-full transition-colors relative ${
            settings.enabled ? "bg-indigo-500" : "bg-white/10"
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
              settings.enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        Displays the current nameday(s) in Sweden
      </p>
    </div>
  );
};

const config: ExtensionConfig = {
  id: "nameday",
  name: "Nameday",
  description: "Displays today's Swedish nameday",
  component: NamedayExtension,
  settingsComponent: SettingsComponent,
  defaultSettings: {
    enabled: true,
  },
};

export default config;
