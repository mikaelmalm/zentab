import { ExtensionConfig, ExtensionSettingsProps } from "../types";
import WeatherExtension from "./index";

const WeatherSettings = ({
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

      {settings.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              City
            </label>
            <input
              type="text"
              value={settings.city || ""}
              onChange={(e) =>
                onUpdateSettings({ ...settings, city: e.target.value })
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. London"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Date Format
            </label>
            <div className="flex bg-zinc-950 rounded border border-zinc-800 p-1">
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, dateFormat: "short" })
                }
                className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                  (settings.dateFormat || "short") === "short"
                    ? "bg-zinc-800 text-white font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Short
              </button>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, dateFormat: "long" })
                }
                className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                  settings.dateFormat === "long"
                    ? "bg-zinc-800 text-white font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Long
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const WeatherConfig: ExtensionConfig = {
  id: "weather",
  name: "Weather & Date",
  description: "Display current date and weather for your city",
  component: WeatherExtension,
  settingsComponent: WeatherSettings,
  defaultSettings: {
    enabled: true,
    city: "Stockholm",
    dateFormat: "short",
  },
};

export default WeatherConfig;
