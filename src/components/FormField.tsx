import { Form, Input } from "antd";
import { SchemaProperty } from "../schemaStore/schemaTypes";
import { renderArrayField, renderBooleanField, renderIntegerField, renderObjectField, renderStringField } from "./formField.utils";

interface FormFieldProps {
    property: SchemaProperty;
    path: string;
    control: any;
    parentPath?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ property, path, control, parentPath }) => {
    const fullPath = parentPath ? `${parentPath}.${path}` : path;

    const renderField = () => {
        switch (property.type) {
            case 'string':
                return renderStringField({ fullPath, control, property });
            case 'integer':
                return renderIntegerField({ fullPath, control, property });
            case 'boolean':
                return renderBooleanField({ fullPath, control, property });
            case 'object':
                return renderObjectField({ fullPath, control, property });
            case 'array':
                return renderArrayField({ fullPath, control, property });
            default:
                return <Input placeholder="Unsupported field type" disabled />;
        }
    };

    const isBoolean = property.type === 'boolean';

    return (
        <Form.Item
            label={property.name}
            style={{ marginBottom: 16 }}
            valuePropName={isBoolean ? 'checked' : 'value'}
        >
            {renderField()}
        </Form.Item>
    );
};
