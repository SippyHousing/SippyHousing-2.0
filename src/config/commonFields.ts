export type FieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'textarea' 
  | 'date' 
  | 'array'
  | 'url';

export interface CategoryField {
  name: string;
  key: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  unit?: string;
  unitOptions?: string[];
  conditional?: {
    field: string;
    value?: any;
    /** When set, show when watched value is in this array (e.g. ['Rent', 'Sale']) */
    values?: string[];
  };
  rows?: number; // For textarea
}

export const COMMON_FIELDS: CategoryField[] = [
  {
    name: 'Header',
    key: 'header',
    type: 'text',
    placeholder: 'Enter property header/title'
  },
  {
    name: 'Description',
    key: 'description',
    type: 'textarea',
    placeholder: 'Enter property description',
    rows: 4
  },
  {
    name: 'Location',
    key: 'location',
    type: 'text',
    placeholder: 'Enter location'
  },
  {
    name: 'Sub-Location',
    key: 'sub_location',
    type: 'text',
    placeholder: 'Enter sub-location'
  },
  {
    name: 'City',
    key: 'city',
    type: 'text',
    placeholder: 'Enter city'
  },
  {
    name: 'Country',
    key: 'country',
    type: 'text',
    placeholder: 'Enter country'
  }
//   {
//   key: 'property_code',
//   name: 'Property Code',
//   type: 'text',
//   placeholder: 'LUX-001'
// },
// {
//   key: 'real_property_name',
//   name: 'Real Property Name',
//   type: 'text',
//   placeholder: 'Burj Khalifa'
// }
];
