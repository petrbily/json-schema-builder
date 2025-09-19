import { FormOutlined, MoonOutlined, SettingOutlined, SunOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, Space, Switch, Tabs, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import './App.css';
import DynamicFormGenerator from './components/DynamicFormGenerator.tsx';
import { SchemaBuilder } from './components/SchemaBuilder.tsx';
import useLocalStorage from './hooks/useLocalStorage';
import { _setSchemaForTest } from './schemaStore/schemaStore';

function App() {
  const [schemaReady, setSchemaReady] = useState(false);
  const [updatedSchema, setUpdatedSchema] = useState({ properties: {} });
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <Space>
          <SettingOutlined />
          Schema Builder
        </Space>
      ),
      children: <SchemaBuilder isDarkMode={isDarkMode} setUpdatedSchema={setUpdatedSchema} />,
    },
    {
      key: '2',
      label: (
        <Space>
          <FormOutlined />
          Dynamic Form
        </Space>
      ),
      children: <DynamicFormGenerator schema={updatedSchema} initialData={{}} isDarkMode={isDarkMode} />,
    },
  ];

  useEffect(() => {
    fetch('/properties.json')
      .then(res => res.json())
      .then(data => {
        function fixProperty(key: string, value: any) {
          const fixed = { ...value, name: key, type: value.type };
          if (value.type === 'object' && value.properties) {
            fixed.properties = Object.fromEntries(
              Object.entries(value.properties).map(([k, v]) => [k, fixProperty(k, v)])
            );
          }
          if (value.type === 'array' && value.items) {
            fixed.items = fixProperty('items', value.items);
          }
          return fixed;
        }
        const withNames = {
          properties: Object.fromEntries(
            Object.entries(data.properties).map(([key, value]) => [key, fixProperty(key, value)])
          )
        };
        _setSchemaForTest(withNames);
        setSchemaReady(true);
      });
  }, []);

  if (!schemaReady) return <div>Loading schema...</div>;
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#ff7558',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Header style={{ backgroundColor: '#95a6b6', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/logo-finshape2022.svg" alt="Company Logo" style={{ height: '32px' }} />
            Schema Builder & Dynamic Form
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SunOutlined style={{ color: '#fff' }} />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              size="small"
            />
            <MoonOutlined style={{ color: '#fff' }} />
          </div>
        </Header>
        <Content style={{ padding: 24 }}>
          <Tabs items={tabItems} defaultActiveKey="1" />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App
