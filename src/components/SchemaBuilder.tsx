import { Collapse } from 'antd';
import React, { useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { github, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { schemaStore } from '../schemaStore/schemaStore.ts';
import type { RootSchema } from '../schemaStore/schemaTypes.ts';
import { SchemaBuilderContent } from './SchemaBuilderContent.tsx';

interface SchemaBuilderProps {
  isDarkMode: boolean;
  setUpdatedSchema: (schema: RootSchema) => void;
}

SyntaxHighlighter.registerLanguage('json', json);

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ isDarkMode, setUpdatedSchema }) => {
  const [schema, setSchema] = React.useState<RootSchema>(schemaStore.getSchema());

  useEffect(() => {
    const unsub = schemaStore.subscribe(setSchema);
    return unsub;
  }, []);

  useEffect(() => {
    setUpdatedSchema(schema);
  }, [schema]);


  return (
    <>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Schema JSON Preview',
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
                {JSON.stringify(schema, null, 2)}
              </SyntaxHighlighter>
            )
          },
        ]}
        style={{ margin: '16px 0' }} />
      <SchemaBuilderContent schema={schema} />
    </>
  );
};