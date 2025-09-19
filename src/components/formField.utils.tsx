import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Card, Input, InputNumber, Select, Space, Switch } from "antd";
import { Controller, useFieldArray } from "react-hook-form";
import { SchemaProperty } from "../schemaStore/schemaTypes";
import { FormField } from "./FormField";

export const renderStringField = ({ fullPath, control, property }: { fullPath: string, control: any, property: SchemaProperty }) => {
    if (property.enum && property.enum.length > 0) {
        return (
            <Controller
                name={fullPath}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        placeholder={`Select ${property.name}`}
                        options={property.enum!.map(value => ({ label: value, value }))}
                    />
                )}
            />
        );
    }

    return (
        <Controller
            name={fullPath}
            control={control}
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder={property.description || `Enter ${property.name}`}
                />
            )}
        />
    );
};

export const renderIntegerField = ({ fullPath, control, property }: { fullPath: string, control: any, property: SchemaProperty }) => (
    <Controller
        name={fullPath}
        control={control}
        render={({ field }) => (
            <InputNumber
                {...field}
                style={{ width: '100%' }}
                placeholder={property.description || `Enter ${property.name}`}
            />
        )}
    />
);

export const renderBooleanField = ({ fullPath, control, property }: { fullPath: string, control: any, property: SchemaProperty }) => (
    <Controller
        name={fullPath}
        control={control}
        render={({ field }) => (
            <Switch
                {...field}
                checked={field.value}
                checkedChildren="True"
                unCheckedChildren="False"
            />
        )}
    />
);

export const renderObjectField = ({ fullPath, control, property }: { fullPath: string, control: any, property: SchemaProperty }) => {
    if (!property.properties || Object.keys(property.properties).length === 0) {
        return <div style={{ color: '#999', fontStyle: 'italic' }}>No properties defined for this object</div>;
    }

    return (
        <Card size="small" style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                {Object.values(property.properties).map((subProperty) => (
                    <FormField
                        key={subProperty.name}
                        property={subProperty}
                        path={subProperty.name}
                        control={control}
                        parentPath={fullPath}
                    />
                ))}
            </Space>
        </Card>
    );
};

export const renderArrayField = ({ fullPath, control, property }: { fullPath: string, control: any, property: SchemaProperty }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: fullPath,
    });

    if (!property.items) {
        return <div style={{ color: '#999', fontStyle: 'italic' }}>No item type defined for this array</div>;
    }

    const addItem = () => {
        let defaultValue;
        switch (property.items!.type) {
            case 'string':
                defaultValue = '';
                break;
            case 'integer':
                defaultValue = 0;
                break;
            case 'boolean':
                defaultValue = false;
                break;
            case 'object':
                defaultValue = {};
                break;
            default:
                defaultValue = '';
        }
        append(defaultValue);
    };

    return (
        <Card size="small" style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Items ({property.items.type})</span>
                    <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} size="small">
                        Add Item
                    </Button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <FormField
                                property={property.items!}
                                path={`${index}`}
                                control={control}
                                parentPath={fullPath}
                            />
                        </div>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(index)}
                            size="small"
                        />
                    </div>
                ))}
                {fields.length === 0 && (
                    <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 16 }}>
                        No items added yet
                    </div>
                )}
            </Space>
        </Card>
    );
};
