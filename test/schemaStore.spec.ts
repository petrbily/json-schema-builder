import { schemaStore, _setSchemaForTest } from '../src/schemaStore/schemaStore';
import type { SchemaProperty, RootSchema } from '../src/schemaStore/schemaTypes';

describe('schemaStore', () => {
	const mockSchema: RootSchema = {
		properties: {
			address: {
				name: 'address',
				type: 'object',
				description: 'Address',
				properties: {}
			}
		}
	};

	beforeEach(() => {
		_setSchemaForTest(mockSchema);
	});

	it('should get initial schema', () => {
		const schema = schemaStore.getSchema();
		expect(schema).toBeDefined();
		expect(schema.properties).toBeDefined();
        
		expect(Object.keys(schema.properties).length).toBeGreaterThan(0);
	});

	it('should add a property at root - type \'string\'', () => {
		const newProp: SchemaProperty = {
			name: 'testProp',
			type: 'string',
			description: 'A string property',
		};
		schemaStore.addProperty([], newProp);
		const schema = schemaStore.getSchema();
		expect(schema.properties['testProp']).toBeDefined();
		expect(schema.properties['testProp'].type).toBe('string');
        expect(schema.properties['testProp'].description).toBe('A string property');
	});

    it('should add a property at root - type \'integer\'', () => {
		const newProp: SchemaProperty = {
            name: 'intProp',
            type: 'integer',
            description: 'An integer property',
        };
		schemaStore.addProperty([], newProp);
		const schema = schemaStore.getSchema();
		expect(schema.properties['intProp']).toBeDefined();
		expect(schema.properties['intProp'].type).toBe('integer');
        expect(schema.properties['intProp'].description).toBe('An integer property');
	});

    it('should add a property at root - type \'boolean\'', () => {
        const newProp: SchemaProperty = {
            name: 'boolProp',
            type: 'boolean',
            description: 'A boolean property',
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['boolProp']).toBeDefined();
        expect(schema.properties['boolProp'].type).toBe('boolean');
        expect(schema.properties['boolProp'].description).toBe('A boolean property');
    });

    it('should add a property at root - type \'object\'', () => {
        const newProp: SchemaProperty = {
            name: 'objProp',
            type: 'object',
            description: 'An object property',
            properties: {
                subPropString: {
                    name: 'subPropString',
                    description: 'A string sub-property',
                    type: 'string',
                },
                subPropInteger: {
                    name: 'subPropInteger',
                    description: 'An integer sub-property',
                    type: 'integer',
                },
                subPropBoolean: {
                    name: 'subPropBoolean',
                    description: 'A boolean sub-property',
                    type: 'boolean',
                },
                subPropArray: {
                    name: 'subPropArray',
                    description: 'An array sub-property',
                    type: 'array',
                    items: {
                        name: 'item',
                        type: 'string',
                    }
                },
                subPropObject: {
                    name: 'subPropObject',
                    description: 'An object sub-property',
                    type: 'object',
                    properties: {
                        nestedProp: {
                            name: 'nestedProp',
                            type: 'string',
                        }
                    }
                }
            }
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['objProp']).toBeDefined();
        expect(schema.properties['objProp'].type).toBe('object');
        expect(schema.properties['objProp'].description).toBe('An object property');
        expect(schema.properties['objProp'].properties).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropString']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropString'].description).toBe('A string sub-property');
        expect(schema.properties['objProp'].properties!['subPropString'].type).toBe('string');
        expect(schema.properties['objProp'].properties!['subPropInteger']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropInteger'].description).toBe('An integer sub-property');
        expect(schema.properties['objProp'].properties!['subPropInteger'].type).toBe('integer');
        expect(schema.properties['objProp'].properties!['subPropBoolean']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropBoolean'].description).toBe('A boolean sub-property');
        expect(schema.properties['objProp'].properties!['subPropBoolean'].type).toBe('boolean');
        expect(schema.properties['objProp'].properties!['subPropArray']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropArray'].description).toBe('An array sub-property');
        expect(schema.properties['objProp'].properties!['subPropArray'].type).toBe('array');
        expect(schema.properties['objProp'].properties!['subPropArray'].items).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropArray'].items!.type).toBe('string');
        expect(schema.properties['objProp'].properties!['subPropObject']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropObject'].description).toBe('An object sub-property');
        expect(schema.properties['objProp'].properties!['subPropObject'].type).toBe('object');
        expect(schema.properties['objProp'].properties!['subPropObject'].properties).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropObject'].properties!['nestedProp']).toBeDefined();
        expect(schema.properties['objProp'].properties!['subPropObject'].properties!['nestedProp'].type).toBe('string');
    });

    it('should add a property at root - type \'array\' - string items', () => {
        const newProp: SchemaProperty = {
            name: 'arrayProp',
            type: 'array',
            description: 'An array property',
            items: {
                name: 'stringItem',
                type: 'string',
            }
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['arrayProp']).toBeDefined();
        expect(schema.properties['arrayProp'].type).toBe('array');
        expect(schema.properties['arrayProp'].description).toBe('An array property');
        expect(schema.properties['arrayProp'].items).toBeDefined();
        expect(schema.properties['arrayProp'].items!.type).toBe('string');
        expect(schema.properties['arrayProp'].items!.name).toBe('stringItem');
    });

    it('should add a property at root - type \'array\' - integer items', () => {
        const newProp: SchemaProperty = {
            name: 'arrayPropInt',
            type: 'array',
            description: 'An array property with integer items',
            items: {
                name: 'intItem',
                type: 'integer',
            }
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['arrayPropInt']).toBeDefined();
        expect(schema.properties['arrayPropInt'].type).toBe('array');
        expect(schema.properties['arrayPropInt'].description).toBe('An array property with integer items');
        expect(schema.properties['arrayPropInt'].items).toBeDefined();
        expect(schema.properties['arrayPropInt'].items!.type).toBe('integer');
        expect(schema.properties['arrayPropInt'].items!.name).toBe('intItem');
    });

    it('should add a property at root - type \'array\' - boolean items', () => {
        const newProp: SchemaProperty = {
            name: 'arrayPropBool',
            type: 'array',
            description: 'An array property with boolean items',
            items: {
                name: 'boolItem',
                type: 'boolean',
            }
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['arrayPropBool']).toBeDefined();
        expect(schema.properties['arrayPropBool'].type).toBe('array');
        expect(schema.properties['arrayPropBool'].description).toBe('An array property with boolean items');
        expect(schema.properties['arrayPropBool'].items).toBeDefined();
        expect(schema.properties['arrayPropBool'].items!.type).toBe('boolean');
        expect(schema.properties['arrayPropBool'].items!.name).toBe('boolItem');
    });

    it('should add a property at root - type \'array\' - object items', () => {
        const newProp: SchemaProperty = {
            name: 'arrayPropObj',
            type: 'array',
            description: 'An array property with object items',
            items: {
                name: 'objItem',
                type: 'object',
                properties: {
                    itemProp: {
                        name: 'itemProp',
                        type: 'string',
                    }
                }
            }
        };
        schemaStore.addProperty([], newProp);
        const schema = schemaStore.getSchema();
        expect(schema.properties['arrayPropObj']).toBeDefined();
        expect(schema.properties['arrayPropObj'].type).toBe('array');
        expect(schema.properties['arrayPropObj'].description).toBe('An array property with object items');
        expect(schema.properties['arrayPropObj'].items).toBeDefined();
        expect(schema.properties['arrayPropObj'].items!.type).toBe('object');
        expect(schema.properties['arrayPropObj'].items!.name).toBe('objItem');
        expect(schema.properties['arrayPropObj'].items!.properties).toBeDefined();
        expect(schema.properties['arrayPropObj'].items!.properties!['itemProp']).toBeDefined();
        expect(schema.properties['arrayPropObj'].items!.properties!['itemProp'].type).toBe('string');
    });

	it('should edit a property - description', () => {
		const newProp: SchemaProperty = {
			name: 'testProp',
			type: 'string',
			description: 'A test property',
		};
		schemaStore.addProperty([], newProp);
		schemaStore.editProperty(['testProp'], { description: 'Updated description' });
		const schema = schemaStore.getSchema();
		expect(schema.properties['testProp'].description).toBe('Updated description');
	});

    it('should edit a property - type - integer', () => {
        const newProp: SchemaProperty = {
            name: 'testProp',
            type: 'string',
            description: 'A test property',
        };
        schemaStore.addProperty([], newProp);
        schemaStore.editProperty(['testProp'], { type: 'integer' });
        const schema = schemaStore.getSchema();
        expect(schema.properties['testProp'].type).toBe('integer');
    });

    it('should edit a property - type - boolean', () => {
        const newProp: SchemaProperty = {
            name: 'testProp',
            type: 'string',
            description: 'A test property',
        };
        schemaStore.addProperty([], newProp);
        schemaStore.editProperty(['testProp'], { type: 'boolean' });
        const schema = schemaStore.getSchema();
        expect(schema.properties['testProp'].type).toBe('boolean');
    });

    it('should edit a property - type - object', () => {
        const newProp: SchemaProperty = {
            name: 'testProp',
            type: 'string',
            description: 'A test property',
        };
        schemaStore.addProperty([], newProp);
        schemaStore.editProperty(['testProp'], { type: 'object', properties: {
            subProp: {
                name: 'subProp',
                type: 'string',
            }
        } });
        const schema = schemaStore.getSchema();
        expect(schema.properties['testProp'].type).toBe('object');
        expect(schema.properties['testProp'].properties).toBeDefined();
        expect(schema.properties['testProp'].properties!['subProp']).toBeDefined();
        expect(schema.properties['testProp'].properties!['subProp'].type).toBe('string');
    });

    it('should edit a property - type - array', () => {
        const newProp: SchemaProperty = {
            name: 'testProp',
            type: 'string',
            description: 'A test property',
        };
        schemaStore.addProperty([], newProp);
        schemaStore.editProperty(['testProp'], { type: 'array', items: {
            name: 'item',
            type: 'string',
        } });
        const schema = schemaStore.getSchema();
        expect(schema.properties['testProp'].type).toBe('array');
        expect(schema.properties['testProp'].items).toBeDefined();
        expect(schema.properties['testProp'].items!.type).toBe('string');
    });

	it('should delete a property', () => {
		schemaStore.deleteProperty(['testProp']);
		const schema = schemaStore.getSchema();
		expect(schema.properties['testProp']).toBeUndefined();
	});

	it('should add nested property', () => {
		const nestedProp: SchemaProperty = {
			name: 'nested',
			type: 'string',
		};
		schemaStore.addProperty(['address'], nestedProp);
		const schema = schemaStore.getSchema();
		expect(schema.properties['address'].properties!['nested']).toBeDefined();
	});

	it('should edit nested property', () => {
		const nestedProp: SchemaProperty = {
			name: 'nested',
			type: 'string',
		};
		schemaStore.addProperty(['address'], nestedProp);
		schemaStore.editProperty(['address', 'nested'], { description: 'Nested description' });
		const schema = schemaStore.getSchema();
		expect(schema.properties['address'].properties!['nested'].description).toBe('Nested description');
	});

	it('should delete nested property', () => {
		schemaStore.deleteProperty(['address', 'nested']);
		const schema = schemaStore.getSchema();
		expect(schema.properties['address'].properties!['nested']).toBeUndefined();
	});

	describe('Property name editing behavior', () => {
		beforeEach(() => {
			// Add a test property to edit
			const testProp: SchemaProperty = {
				name: 'originalName',
				type: 'string',
				description: 'Original description',
			};
			schemaStore.addProperty([], testProp);
		});

		it('should update property name and maintain object key consistency at root level', () => {
			// Edit the property name
			schemaStore.editProperty(['originalName'], { name: 'newName' });
			const schema = schemaStore.getSchema();

			// Old key should not exist
			expect(schema.properties['originalName']).toBeUndefined();
			
			// New key should exist with updated name
			expect(schema.properties['newName']).toBeDefined();
			expect(schema.properties['newName'].name).toBe('newName');
			expect(schema.properties['newName'].type).toBe('string');
			expect(schema.properties['newName'].description).toBe('Original description');
		});

		it('should allow deletion after name change', () => {
			// Edit the property name
			schemaStore.editProperty(['originalName'], { name: 'renamedProperty' });
			
			// Verify the rename worked
			let schema = schemaStore.getSchema();
			expect(schema.properties['renamedProperty']).toBeDefined();
			expect(schema.properties['originalName']).toBeUndefined();

			// Delete using the new name should work
			schemaStore.deleteProperty(['renamedProperty']);
			schema = schemaStore.getSchema();
			expect(schema.properties['renamedProperty']).toBeUndefined();
		});

		it('should update nested property name and maintain object key consistency', () => {
			// Add a nested property first
			const nestedProp: SchemaProperty = {
				name: 'nestedOriginal',
				type: 'integer',
				description: 'Nested property',
			};
			schemaStore.addProperty(['address'], nestedProp);

			// Edit the nested property name
			schemaStore.editProperty(['address', 'nestedOriginal'], { name: 'nestedRenamed' });
			const schema = schemaStore.getSchema();

			// Old nested key should not exist
			expect(schema.properties['address'].properties!['nestedOriginal']).toBeUndefined();
			
			// New nested key should exist with updated name
			expect(schema.properties['address'].properties!['nestedRenamed']).toBeDefined();
			expect(schema.properties['address'].properties!['nestedRenamed'].name).toBe('nestedRenamed');
			expect(schema.properties['address'].properties!['nestedRenamed'].type).toBe('integer');
			expect(schema.properties['address'].properties!['nestedRenamed'].description).toBe('Nested property');
		});

		it('should allow deletion of nested property after name change', () => {
			// Add a nested property first
			const nestedProp: SchemaProperty = {
				name: 'deepOriginal',
				type: 'boolean',
			};
			schemaStore.addProperty(['address'], nestedProp);

			// Edit the nested property name
			schemaStore.editProperty(['address', 'deepOriginal'], { name: 'deepRenamed' });
			
			// Verify the rename worked
			let schema = schemaStore.getSchema();
			expect(schema.properties['address'].properties!['deepRenamed']).toBeDefined();
			expect(schema.properties['address'].properties!['deepOriginal']).toBeUndefined();

			// Delete using the new path should work
			schemaStore.deleteProperty(['address', 'deepRenamed']);
			schema = schemaStore.getSchema();
			expect(schema.properties['address'].properties!['deepRenamed']).toBeUndefined();
		});

		it('should handle name editing while preserving other property changes', () => {
			// Edit multiple properties including name
			schemaStore.editProperty(['originalName'], { 
				name: 'multiEditName',
				description: 'Updated description',
				type: 'integer'
			});
			const schema = schemaStore.getSchema();

			// Old key should not exist
			expect(schema.properties['originalName']).toBeUndefined();
			
			// New key should exist with all updates
			expect(schema.properties['multiEditName']).toBeDefined();
			expect(schema.properties['multiEditName'].name).toBe('multiEditName');
			expect(schema.properties['multiEditName'].type).toBe('integer');
			expect(schema.properties['multiEditName'].description).toBe('Updated description');
		});

		it('should handle editing without name change normally', () => {
			// Edit without changing name
			schemaStore.editProperty(['originalName'], { 
				description: 'Updated description only',
				type: 'boolean'
			});
			const schema = schemaStore.getSchema();

			// Original key should still exist
			expect(schema.properties['originalName']).toBeDefined();
			expect(schema.properties['originalName'].name).toBe('originalName');
			expect(schema.properties['originalName'].type).toBe('boolean');
			expect(schema.properties['originalName'].description).toBe('Updated description only');
		});
	});
});
