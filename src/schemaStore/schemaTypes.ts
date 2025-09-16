// Supported types for schema properties
export type SchemaType = 'string' | 'integer' | 'boolean' | 'object' | 'array';

// Main property type for the schema
export interface SchemaProperty {
  name: string;
  type: SchemaType;
  description?: string;
  enum?: string[];
  properties?: Record<string, SchemaProperty>; // for objects
  items?: SchemaProperty; // for arrays
}

// Root schema type (matches properties.json)
export interface RootSchema {
  properties: Record<string, SchemaProperty>;
}

// Store methods interface
export interface SchemaStoreMethods {
  getSchema(): RootSchema;
  subscribe(fn: (schema: RootSchema) => void): () => void;
  addProperty(path: string[], property: SchemaProperty): void;
  editProperty(path: string[], updates: Partial<SchemaProperty>): void;
  deleteProperty(path: string[]): void;
}
