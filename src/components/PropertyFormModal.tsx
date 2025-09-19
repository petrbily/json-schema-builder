import { Breadcrumb, Button, Descriptions, Form, Input, Modal, Select } from 'antd';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { SchemaProperty, SchemaType } from '../schemaStore/schemaTypes';

interface FormData extends SchemaProperty {
    itemsType?: SchemaType;
}

const typeOptions = [
    { label: 'String', value: 'string' },
    { label: 'Integer', value: 'integer' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Object', value: 'object' },
    { label: 'Array', value: 'array' },
];

interface PropertyFormModalProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (data: SchemaProperty) => void;
    initial?: Partial<SchemaProperty>;
    isEdit?: boolean;
    path?: string[];
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ open, onCancel, onSubmit, initial, isEdit, path }) => {
    const { control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: initial || { name: '', type: 'string', description: '' },
    });

    const watchedType = useWatch({
        control,
        name: 'type',
        defaultValue: initial?.type || 'string'
    });

    React.useEffect(() => {
        const defaultValues = { name: '', type: 'string' as SchemaType, description: '', ...initial };
        const formData: FormData = {
            ...defaultValues,
            itemsType: initial?.items?.type
        };
        reset(formData);
    }, [initial, reset, open]);

    const handleFormSubmit = (data: any) => {
        let processedData: SchemaProperty = {
            ...data,
            enum: data.enum && data.enum.length > 0 ? data.enum : undefined
        };

        if (data.type === 'array' && data.itemsType) {
            processedData.items = {
                type: data.itemsType,
                name: 'items'
            };
            delete (processedData as any).itemsType;
        }

        onSubmit(processedData);
    };

    const getBreadcrumbItems = () => {
        const items = [{ title: 'root' }];
        if (path && path.length > 0) {
            path.forEach(segment => {
                if (segment !== 'items') {
                    items.push({ title: segment });
                }
            });
        }
        return items;
    };

    return (
        <Modal
            open={open}
            title={isEdit ? 'Edit property' : 'Add property'}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            {(path && path.length > 0) || isEdit ? (
                <Descriptions size="small" column={1} style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="Path"><Breadcrumb items={getBreadcrumbItems()} /></Descriptions.Item>
                </Descriptions>
            ) : null}
            <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
                <Form.Item label="Name" required>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <Input {...field} />}
                    />
                </Form.Item>
                <Form.Item label="Type" required>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => <Select {...field} options={typeOptions} />}
                    />
                </Form.Item>
                <Form.Item label="Description">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <Input {...field} />}
                    />
                </Form.Item>
                {watchedType === 'string' && (
                    <Form.Item label="Enum Values">
                        <Controller
                            name="enum"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    placeholder="Add enum values"
                                    value={field.value || []}
                                    onChange={(values) => {
                                        field.onChange(values);
                                    }}
                                    tokenSeparators={[',']}
                                />
                            )}
                        />
                    </Form.Item>
                )}
                {watchedType === 'array' && (
                    <Form.Item label="Array Item Type" required>
                        <Controller
                            name="itemsType"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Select {...field} options={typeOptions} placeholder="Select item type" />}
                        />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {isEdit ? 'Save changes' : 'Add property'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PropertyFormModal;
