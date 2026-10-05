// Central metadata: relationships, search fields and output fields.
// V3 query generation should consume these structures instead of hard-coding paths.
import type { ColumnType, TableName } from "./tables.gen";
export { TABLES, TABLE_BY_NAME } from "./tables.gen";
export type { TableName, ColumnType, TableMeta, ColumnMeta } from "./tables.gen";

export interface Relationship {
  from: { table: TableName; column: string };
  to: { table: TableName; column: string };
  cardinality: "many-to-one";
  key: "client_code" | "form_number";
}

/** Logical relationships (validated in data, not enforced as DB constraints so invalid rows remain visible). */
export const RELATIONSHIPS: Relationship[] = [
  { from: { table: "user_account_information", column: "client_code" }, to: { table: "user_details", column: "client_code" }, cardinality: "many-to-one", key: "client_code" },
  { from: { table: "user_address_details", column: "form_number" }, to: { table: "user_account_information", column: "form_number" }, cardinality: "many-to-one", key: "form_number" },
  { from: { table: "user_personal_details", column: "form_number" }, to: { table: "user_account_information", column: "form_number" }, cardinality: "many-to-one", key: "form_number" },
  { from: { table: "client_details", column: "client_code" }, to: { table: "user_details", column: "client_code" }, cardinality: "many-to-one", key: "client_code" },
  { from: { table: "client_details", column: "form_number" }, to: { table: "user_account_information", column: "form_number" }, cardinality: "many-to-one", key: "form_number" },
];

export type SearchFieldKey = "mobile" | "pan" | "client_code" | "form_number" | "name";

export interface SearchField {
  key: SearchFieldKey;
  label: string;
  table: TableName;
  column: string;
  datatype: ColumnType;
  searchType: "exact" | "name_ci";
  normalization: string;
  placeholder: string;
  bulk: boolean;
  normalize: (raw: string) => string;
  validate: (normalized: string) => string | null; // returns error message or null
}

export const SEARCH_FIELDS: SearchField[] = [
  {
    key: "mobile", label: "Mobile Number", table: "user_address_details", column: "user_mobile_number",
    datatype: "TEXT", searchType: "exact", normalization: "Strip spaces/dashes, drop +91 or leading 0",
    placeholder: "9000000001", bulk: true,
    normalize: (r) => { let v = r.replace(/[\s\-()]/g, ""); if (v.startsWith("+91")) v = v.slice(3); if (v.length === 11 && v.startsWith("0")) v = v.slice(1); return v; },
    validate: (v) => (/^\d{10}$/.test(v) ? null : "Mobile number must be 10 digits"),
  },
  {
    key: "pan", label: "PAN Number", table: "client_details", column: "client_pan_number",
    datatype: "TEXT", searchType: "exact", normalization: "Trim, uppercase",
    placeholder: "ZZZB0001Q", bulk: true,
    normalize: (r) => r.trim().toUpperCase(),
    validate: (v) => (/^[A-Z0-9]{10}$/.test(v) ? null : "PAN must be 10 alphanumeric characters"),
  },
  {
    key: "client_code", label: "Client Code", table: "user_details", column: "client_code",
    datatype: "TEXT", searchType: "exact", normalization: "Trim, uppercase",
    placeholder: "CL000001", bulk: true,
    normalize: (r) => r.trim().toUpperCase(),
    validate: (v) => (/^[A-Z0-9]{2,20}$/.test(v) ? null : "Client code must be 2–20 letters/digits"),
  },
  {
    key: "form_number", label: "Form Number", table: "user_account_information", column: "form_number",
    datatype: "BIGINT", searchType: "exact", normalization: "Trim, digits only",
    placeholder: "100000001", bulk: true,
    normalize: (r) => r.trim().replace(/\.0+$/, ""),
    validate: (v) => (/^\d{1,18}$/.test(v) ? null : "Form number must be numeric"),
  },
  {
    key: "name", label: "Name", table: "user_personal_details", column: "user_first_name + user_middle_name + user_last_name",
    datatype: "TEXT", searchType: "name_ci", normalization: "Trim, collapse spaces, case-insensitive (no fuzzy matching)",
    placeholder: "Yash Menon", bulk: false,
    normalize: (r) => r.trim().replace(/\s+/g, " "),
    validate: (v) => (v.length >= 2 && /^[\p{L} .'-]+$/u.test(v) ? null : "Enter a name (letters only)"),
  },
];

export const SEARCH_FIELD_BY_KEY = Object.fromEntries(SEARCH_FIELDS.map((f) => [f.key, f])) as Record<SearchFieldKey, SearchField>;

export interface OutputField {
  key: string;
  label: string;
  table: TableName;
  columns: string[]; // more than one = composite, joined with ", "
  datatype: ColumnType;
  default?: boolean;
}

export const OUTPUT_FIELDS: OutputField[] = [
  { key: "client_code", label: "Client Code", table: "user_details", columns: ["client_code"], datatype: "TEXT", default: true },
  { key: "name", label: "Name", table: "user_personal_details", columns: ["user_first_name", "user_middle_name", "user_last_name"], datatype: "TEXT", default: true },
  { key: "pan", label: "PAN", table: "client_details", columns: ["client_pan_number"], datatype: "TEXT", default: true },
  { key: "mobile", label: "Mobile Number", table: "user_address_details", columns: ["user_mobile_number"], datatype: "TEXT", default: true },
  { key: "form_number", label: "Form Number", table: "user_account_information", columns: ["form_number"], datatype: "BIGINT", default: true },
  { key: "account_type", label: "Account Type", table: "user_account_information", columns: ["user_bank_account_type_self_joint"], datatype: "TEXT", default: true },
  { key: "account_status", label: "Account Status", table: "user_details", columns: ["user_account_status_flag"], datatype: "TEXT", default: true },
  { key: "dob", label: "DOB", table: "user_personal_details", columns: ["user_dob"], datatype: "DATE", default: true },
  { key: "address", label: "Address", table: "user_address_details", columns: ["address_1", "address_2", "user_city", "user_state", "user_pin"], datatype: "TEXT", default: true },
  { key: "email", label: "Email", table: "user_personal_details", columns: ["user_email"], datatype: "TEXT" },
  { key: "residency", label: "Residential / NRI", table: "user_account_information", columns: ["user_type_residential_nri"], datatype: "TEXT" },
  { key: "bank_account", label: "Bank Account Number", table: "user_account_information", columns: ["user_bank_account_number"], datatype: "TEXT" },
  { key: "product_type", label: "Product Type", table: "client_details", columns: ["client_product_type"], datatype: "TEXT" },
];
