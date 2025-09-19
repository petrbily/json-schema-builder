import { Typography } from "antd";
import { SchemaProperty } from "../schemaStore/schemaTypes";

const { Text } = Typography;

export const getPropertyDescriptionItems = (property: SchemaProperty) => {
  return [
    {
      key: 'name',
      children: <Text strong>{property.name}</Text>,
    },
    {
      key: 'type',
      label: 'Type',
      children: property.type + (property.enum ? ` (${property.enum.join(', ')})` : ''),
    },
    {
      key: 'description',
      label: 'Description',
      children: property.description,
    }
  ];
};

export const replacerForJSON = (_key: string, value: any) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((res: any, k) => {
        res[k] = value[k];
        return res;
      }, {});
  }
  return value;
};
