// TypeScript definitions for the Design Token Export plugin

export interface ExportMetadata {
  exportedAt: string;
  figmaFileKey: string;
  collections: number;
}

export interface VariableMode {
  modeId: string;
  name: string;
}

export interface VariableAlias {
  id: string;
  name: string;
}

export interface VariableData {
  id: string;
  name: string;
  description: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  scopes: string[];
  values: Record<string, any>;
  aliases: Record<string, VariableAlias>;
}

export interface CollectionData {
  id: string;
  name: string;
  description: string;
  modes: VariableMode[];
  variables: Record<string, VariableData>;
}

export interface ExportData {
  metadata: ExportMetadata;
  collections: Record<string, CollectionData>;
}

export type PluginMessage = 
  | { type: 'export-tokens' }
  | { type: 'close-plugin' }
  | { type: 'tokens-extracted'; data: ExportData }
  | { type: 'error'; message: string }; 