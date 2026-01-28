// Type definitions for the Design Token Export plugin

export interface ExportData {
  metadata: {
    exportedAt: string;
    figmaFileKey: string | null;
    collections: number;
  };
  collections: Record<string, CollectionData>;
}

export interface CollectionData {
  id: string;
  name: string;
  description: string;
  modes: ModeData[];
  variables: Record<string, VariableData>;
}

export interface ModeData {
  modeId: string;
  name: string;
}

export interface VariableData {
  id: string;
  name: string;
  description: string;
  type: string;
  scopes: string[];
  values: Record<string, any>;
  aliases: Record<string, AliasData>;
}

export interface AliasData {
  id: string;
  name: string;
}

export type ExportFormat = 'json' | 'css' | 'developer' | 'react-native';

export interface UIMessage {
  type: 'export-tokens' | 'close-plugin';
  format?: ExportFormat;
}

export interface PluginMessage {
  type: 'tokens-extracted' | 'error';
  data?: ExportData;
  message?: string;
}

// Color value interface for better type safety
export interface ColorValue {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// Extended window interface for message handling
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    onmessage: (_event: MessageEvent<{ pluginMessage: PluginMessage }>) => void;
  }
}

// W3C Design Tokens Community Group format
export interface DeveloperToken {
  $type: string;
  $value: any;
  $description?: string;
}

export type DeveloperExportData = Record<string, any>;
