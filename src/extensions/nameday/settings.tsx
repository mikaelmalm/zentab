import { ExtensionConfig, ExtensionSettingsProps } from '../types';
import NamedayExtension from './index';

const SettingsComponent = ({ settings, onUpdateSettings }: ExtensionSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
         <input 
           type="checkbox"
           id="nameday-enabled"
           checked={settings.enabled ?? true}
           onChange={(e) => onUpdateSettings({ ...settings, enabled: e.target.checked })}
           className="rounded border-zinc-700 bg-zinc-900 text-white"
         />
         <label htmlFor="nameday-enabled" className="text-sm text-zinc-300">Enable Nameday Display</label>
       </div>
       <p className="text-xs text-zinc-500">
         Displays the current nameday(s) in Sweden using workgroup.se API.
       </p>
    </div>
  );
};

const config: ExtensionConfig = {
  id: 'nameday',
  name: 'Nameday',
  description: 'Displays today\'s Swedish nameday',
  component: NamedayExtension,
  settingsComponent: SettingsComponent,
  defaultSettings: {
    enabled: true,
  },
};

export default config;
