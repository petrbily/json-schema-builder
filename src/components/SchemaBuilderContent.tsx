import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Collapse, Descriptions, Result, Row, Space, Tooltip } from 'antd';
import React from 'react';
import { schemaStore } from '../schemaStore/schemaStore.ts';
import type { RootSchema, SchemaProperty } from '../schemaStore/schemaTypes.ts';
import PropertyFormModal from './PropertyFormModal.tsx';
import { getPropertyDescriptionItems } from './schemaBuilder.utils.tsx';

const { Panel } = Collapse;

interface SchemaBuilderContentProps {
    schema: RootSchema;
}

export const SchemaBuilderContent: React.FC<SchemaBuilderContentProps> = ({ schema }) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editInitial, setEditInitial] = React.useState<Partial<SchemaProperty> | undefined>(undefined);
    const [editPath, setEditPath] = React.useState<string[] | undefined>(undefined);
    const [isEdit, setIsEdit] = React.useState(false);

    const renderProperty = (property: SchemaProperty, path: string[] = []) => {
        if (property.type === 'object') {
            const hasProperties = property.properties && Object.keys(property.properties).length > 0;

            return (
                <div>
                    {hasProperties && (
                        <Collapse>
                            {Object.values(property.properties!).map((child) => {
                                return (
                                    <Panel
                                        key={child.name}
                                        header={
                                            <Row>
                                                <Descriptions
                                                    items={
                                                        getPropertyDescriptionItems(child)
                                                    }
                                                />
                                            </Row>
                                        }
                                        extra={
                                            <Space>
                                                <Tooltip title="Edit">
                                                    <Button icon={<EditOutlined />} onClick={() => openEditModal(child, [...path, child.name])} />
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <Button icon={<DeleteOutlined />} onClick={() => schemaStore.deleteProperty([...path, child.name])} />
                                                </Tooltip>
                                            </Space>
                                        }
                                    >
                                        {renderProperty(child, [...path, child.name])}
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    )}
                    {!hasProperties && (
                        <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                            No properties defined
                        </div>
                    )}
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        style={{ marginTop: 8, width: '100%' }}
                        onClick={handleAddNested(path)}
                    >
                        Add property to {property.name}
                    </Button>
                </div>
            );
        }
        if (property.type === 'array' && property.items) {
            return (
                <Collapse>
                    <Panel
                        header={
                            <Row>
                                <Descriptions
                                    items={
                                        getPropertyDescriptionItems(property.items)
                                    }
                                />
                            </Row>
                        }
                        key="items"
                        extra={
                            <Space>
                                {property.items && (
                                    <Tooltip title="Edit">
                                        <Button icon={<EditOutlined />} onClick={() => openEditModal(property.items!, [...path, 'items'])} />
                                    </Tooltip>
                                )}
                                <Tooltip title="Delete">
                                    <Button icon={<DeleteOutlined />} onClick={() => schemaStore.deleteProperty([...path, 'items'])} />
                                </Tooltip>
                            </Space>
                        }
                    >
                        {property.items && renderProperty(property.items, [...path, 'items'])}
                    </Panel>
                </Collapse>
            );
        }
        return null;
    };

    const openEditModal = React.useCallback((property: SchemaProperty, path: string[]) => {
        setEditInitial(property);
        setEditPath(path);
        setIsEdit(true);
        setModalOpen(true);
    }, []);

    const handleAdd = (parentPath?: string[]) => {
        setEditInitial(undefined);
        setEditPath(parentPath);
        setIsEdit(false);
        setModalOpen(true);
    };

    const handleAddRoot = () => handleAdd();
    const handleAddNested = (parentPath: string[]) => () => handleAdd(parentPath);

    const handleSubmit = (data: SchemaProperty) => {
        if (isEdit && editPath) {
            schemaStore.editProperty(editPath, data);
        } else {
            schemaStore.addProperty(editPath || [], data);
        }
        setModalOpen(false);
    };

    const schemaProperties = Object.values(schema.properties);

    return (
        <>
            {schemaProperties.length === 0 ? (
                <Result
                    title="No properties defined, please add some."
                    extra={
                        <Button type="primary" style={{ marginTop: 16 }} onClick={handleAddRoot}>Add property</Button>
                    }
                />
            ) : (
                <>
                    <Collapse>
                        {Object.values(schema.properties).map((prop) => {
                            const isObjectOrArray = prop.type === 'object' || prop.type === 'array';
                            return (
                                <Panel
                                    key={prop.name}
                                    showArrow={isObjectOrArray ? true : false}
                                    collapsible={isObjectOrArray ? 'icon' : 'disabled'}
                                    header={
                                        <Row>
                                            <Descriptions
                                                items={getPropertyDescriptionItems(prop)}
                                            />
                                        </Row>
                                    }
                                    extra={
                                        <Space>
                                            <Tooltip title="Edit">
                                                <Button icon={<EditOutlined />} onClick={() => openEditModal(prop, [prop.name])} />
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <Button icon={<DeleteOutlined />} onClick={() => schemaStore.deleteProperty([prop.name])} />
                                            </Tooltip>
                                        </Space>
                                    }
                                >
                                    {isObjectOrArray ? renderProperty(prop, [prop.name]) : null}
                                </Panel>
                            );
                        })}
                    </Collapse>
                    <Row>
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 16 }} onClick={handleAddRoot}>Add property</Button>
                    </Row>
                </>
            )}
            <PropertyFormModal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initial={editInitial}
                isEdit={isEdit}
                path={editPath}
            />
        </>
    );
};
