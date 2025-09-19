import { Button, Collapse, Form, Space, Typography } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { RootSchema } from '../schemaStore/schemaTypes';
import { FormField } from './FormField';

const { Title } = Typography;

interface DynamicFormGeneratorProps {
    schema: RootSchema;
    initialData?: any;
    isDarkMode: boolean;
}

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({ schema, initialData, isDarkMode }) => {
    const [formData, setFormData] = React.useState<any>({});
    const { control, handleSubmit, reset } = useForm({
        defaultValues: initialData || {},
    });

    React.useEffect(() => {
        reset(initialData || {});
    }, [initialData, reset]);

    const handleFormSubmit = (data: any) => {
        setFormData(data);
        console.log('Form data submitted:', data);
    };

    const schemaProperties = Object.values(schema.properties || {});

    if (schemaProperties.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <Title level={4}>No Schema Properties</Title>
                <p>Please define some properties in the Schema Builder tab first.</p>
            </div>
        );
    }

    return (
        <>
            <Collapse
                items={[{
                    key: '2',
                    label: 'Form Data Preview',
                    children: (
                        <SyntaxHighlighter
                            language="json"
                            style={isDarkMode ? nightOwl : github}
                            customStyle={{
                                margin: 0,
                                borderRadius: '4px',
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'auto',
                            }}
                            codeTagProps={{
                                style: {
                                    width: '100%',
                                    maxWidth: '100%',
                                    display: 'block',
                                }
                            }}
                            PreTag="div"
                            wrapLongLines={false}
                        >
                            {Object.keys(formData).length > 0
                                ? JSON.stringify(formData, null, 2)
                                : '{\n  // No form data yet - submit the form to see data here\n}'}
                        </SyntaxHighlighter>
                    )
                }
                ]}
                style={{ margin: '16px 0' }} />
            <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {schemaProperties.map((property) => (
                        <FormField
                            key={property.name}
                            property={property}
                            path={property.name}
                            control={control} />
                    ))}
                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button onClick={() => reset()}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Space>
            </Form>
        </>
    );
};

export default DynamicFormGenerator;