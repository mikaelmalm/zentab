import { ComponentType } from 'react';

export interface ExtensionProps {
  settings: any;
}

export interface ExtensionSettingsProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
}

export interface ExtensionConfig {
  id: string;
  name: string;
  description?: string;
  component: ComponentType<ExtensionProps>;
  settingsComponent?: ComponentType<ExtensionSettingsProps>;
  defaultSettings?: any;
}
