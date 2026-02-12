export type Severity = "critical" | "warning" | "info";
export type SourceType = "pdf_text" | "pdf_ocr" | "photo_ocr";

export interface NFDoc {
  id: string;
  nf_key: string;
  unit_code: string;
  supplier_name?: string;
  file_url?: string;
  created_by: string;
  created_at: string;
}

export interface AFDoc {
  id: string;
  af_number: string;
  supplier_name: string;
  unit_code: string;
  raw_text: string;
  source_type: SourceType;
  file_url?: string;
  created_by: string;
  created_at: string;
}

export interface AFItem {
  id: string;
  af_id: string;
  product_name: string;
  qty: number;
  unit: string;
  price?: number;
}

export interface Divergence {
  id: string;
  nf_id: string;
  af_id: string;
  field: string;
  nf_value: string;
  af_value: string;
  severity: Severity;
  created_at: string;
}
