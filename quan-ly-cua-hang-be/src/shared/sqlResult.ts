export interface SQLResult {
  command: string;
  rowCount: number;
  oid?: null;
  rows?: any[];
  fields?: Field[];
  _parsers?: any;
  _types?: any;
  RowCtor?: null;
  rowAsArray?: boolean;
}
export interface Field {
  name?: string;
  tableID?: number;
  columnID?: number;
  dataTypeID?: number;
  dataTypeSize?: number;
  dataTypeModifier?: number;
  format?: string;
}
