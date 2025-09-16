import type { RootSchema, SchemaProperty, SchemaType } from './schemaTypes';

let schema: RootSchema;
const listeners: Array<(schema: RootSchema) => void> = [];

function clone(obj: any) {
  if (obj === undefined) return {};
  return JSON.parse(JSON.stringify(obj));
}

/**
 * For testing: allow setting initial schema
 */
export function _setSchemaForTest(newSchema: RootSchema) {
  schema = clone(newSchema);
  listeners.forEach(fn => fn(clone(schema)));
}

export const schemaStore = {
  /**
   * Returns a deep clone of the current schema.
   * @returns {RootSchema} The current schema object.
   */
  getSchema(): RootSchema {
    return clone(schema);
  },

  /**
   * Subscribes to schema changes. The callback is called with a clone of the schema whenever it changes.
   * @param fn Callback to invoke on schema change.
   * @returns Unsubscribe function.
   */
  subscribe(fn: (schema: RootSchema) => void): () => void {
    listeners.push(fn);
    fn(clone(schema));
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  },

  /**
   * Adds a property to the schema at the specified path. Supports deep nesting for objects and arrays.
   * @param path Path to the parent property (empty for root).
   * @param property Property to add.
   */
  addProperty(path: string[], property: SchemaProperty): void {
    let target: SchemaProperty | RootSchema = schema;
    if (path.length === 0) {
      (target as RootSchema).properties[property.name] = property;
      listeners.forEach(fn => fn(clone(schema)));
      return;
    }
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if ('properties' in target && target.properties && target.properties[key]) {
        target = target.properties[key];
      } else if (
        'type' in target && target.type === 'array' && 'items' in target && target.items && key === 'items'
      ) {
        target = target.items;
      } else {
        if (!('properties' in target) || !target.properties) {
          (target as any).properties = {};
        }
        target = (target as any).properties[key] = {
          type: 'object' as SchemaType,
          name: key,
          properties: {}
        };
      }
    }
    if ('type' in target && target.type === 'object') {
      if (!target.properties) target.properties = {};
      target.properties[property.name] = property;
    } else if ('type' in target && target.type === 'array' && 'items' in target && target.items) {
      if (!target.items.properties) target.items.properties = {};
      target.items.properties[property.name] = property;
    }
    listeners.forEach(fn => fn(clone(schema)));
  },

  /**
   * Edits a property at the specified path. Throws if the property does not exist.
   * @param path Path to the property to edit.
   * @param updates Updates to apply to the property.
   */
  editProperty(path: string[], updates: Partial<SchemaProperty>): void {
    let target: SchemaProperty | RootSchema = schema;
    let parent: SchemaProperty | RootSchema | null = null;
    if (path.length === 0) throw new Error('Cannot edit root');

    // Navigate to the target property and keep track of parent
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (i === 0 && path.length === 1) {
        if (!('properties' in target) || !(target as RootSchema).properties[key]) throw new Error(`Property '${key}' not found at root`);
        parent = target;
        target = (target as RootSchema).properties[key];
      } else if ('properties' in target && target.properties && target.properties[key]) {
        parent = target;
        target = target.properties[key];
      } else if ('items' in target && target.items && key === 'items') {
        parent = target;
        target = target.items;
      } else {
        throw new Error(`Property '${key}' not found in path`);
      }
    }
    if (!target) throw new Error('Target property not found');

    // If the name is being changed, we need to update the parent's properties object
    const oldName = (target as SchemaProperty).name;
    const newName = updates.name;

    if (newName && newName !== oldName && parent) {
      // Create updated property with new values
      const updatedProperty = Object.assign({}, target as SchemaProperty, updates) as SchemaProperty;

      // Handle different parent types
      if ('properties' in parent && parent.properties) {
        // Remove old key and add with new key
        delete parent.properties[oldName];
        parent.properties[newName] = updatedProperty;
      } else if (path[path.length - 1] === 'items' && 'items' in parent) {
        // For array items, just update the property in place
        Object.assign(target, updates);
      }
    } else {
      // No name change, just update in place
      Object.assign(target, updates);
    }

    listeners.forEach(fn => fn(clone(schema)));
  },

  /**
   * Deletes a property at the specified path. Supports root and nested properties.
   * @param path Path to the property to delete.
   */
  deleteProperty(path: string[]): void {
    if (path.length === 0) return;
    let target: SchemaProperty | RootSchema = schema;
    if (path.length === 1) {
      (target as RootSchema).properties[path[0]] && delete (target as RootSchema).properties[path[0]];
      listeners.forEach(fn => fn(clone(schema)));
      return;
    }
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if ('properties' in target && target.properties && target.properties[key]) {
        target = target.properties[key];
      } else if ('items' in target && target.items && key === 'items') {
        target = target.items;
      } else {
        throw new Error('Invalid path');
      }
    }
    const lastKey = path[path.length - 1];
    if ('properties' in target && target.properties && target.properties[lastKey]) {
      delete target.properties[lastKey];
    } else if ('items' in target && target.items && lastKey === 'items') {
      delete target.items;
    }
    listeners.forEach(fn => fn(clone(schema)));
  },
};
