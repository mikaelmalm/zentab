import { ExtensionConfig } from './types';
import NamedayConfig from './nameday/settings';

import WeatherConfig from './weather/settings';

const extensions: ExtensionConfig[] = [
  NamedayConfig,
  WeatherConfig,
];

export const getExtensions = () => extensions;
export const getExtension = (id: string) => extensions.find(e => e.id === id);
