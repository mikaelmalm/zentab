import { ExtensionConfig } from './types';
import NamedayConfig from './nameday/settings';

const extensions: ExtensionConfig[] = [
  NamedayConfig,
];

export const getExtensions = () => extensions;
export const getExtension = (id: string) => extensions.find(e => e.id === id);
