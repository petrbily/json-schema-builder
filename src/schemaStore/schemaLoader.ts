import type { RootSchema } from './schemaTypes';

export async function loadSchemaFromJson(): Promise<RootSchema | undefined> {
  try {
    // @ts-ignore
    const propertiesJson = await import('../../data/properties.json');
    return propertiesJson.default as RootSchema;
  } catch (e) {
    return undefined;
  }
}
