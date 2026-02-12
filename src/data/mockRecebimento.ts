import { NFDoc, AFDoc, AFItem, Divergence } from "@/types/recebimento";

export const mockNFs: NFDoc[] = [
  {
    id: "nf-1",
    nf_key: "35250212345678000100550010000012341000012345",
    unit_code: "9152",
    supplier_name: "Distribuidora Alimentos Ltda",
    created_by: "user-1",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "nf-2",
    nf_key: "35250298765432000100550010000056781000056789",
    unit_code: "6023",
    supplier_name: "Hortifruti Brasil SA",
    created_by: "user-1",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "nf-3",
    nf_key: "35250211223344000100550010000099991000099999",
    unit_code: "9152",
    supplier_name: "Laticínios Minas Gerais",
    created_by: "user-1",
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export const mockAFs: AFDoc[] = [
  {
    id: "af-1",
    af_number: "AF-2025/001234",
    supplier_name: "Distribuidora Alimentos Ltda",
    unit_code: "9152",
    raw_text: "Autorização de Fornecimento AF-2025/001234\nFornecedor: Distribuidora Alimentos Ltda\nArroz tipo 1 - 500kg - R$3,50/kg\nFeijão carioca - 200kg - R$6,80/kg\nÓleo de soja - 100L - R$5,20/L",
    source_type: "pdf_text",
    created_by: "user-1",
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: "af-2",
    af_number: "AF-2025/001235",
    supplier_name: "Hortifruti Brasil SA",
    unit_code: "6023",
    raw_text: "Autorização de Fornecimento AF-2025/001235\nFornecedor: Hortifruti Brasil SA\nBatata inglesa - 300kg - R$4,00/kg\nCenoura - 150kg - R$3,20/kg\nTomate - 200kg - R$5,50/kg",
    source_type: "pdf_ocr",
    created_by: "user-1",
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
];

export const mockAFItems: AFItem[] = [
  { id: "afi-1", af_id: "af-1", product_name: "Arroz tipo 1", qty: 500, unit: "kg", price: 3.5 },
  { id: "afi-2", af_id: "af-1", product_name: "Feijão carioca", qty: 200, unit: "kg", price: 6.8 },
  { id: "afi-3", af_id: "af-1", product_name: "Óleo de soja", qty: 100, unit: "L", price: 5.2 },
  { id: "afi-4", af_id: "af-2", product_name: "Batata inglesa", qty: 300, unit: "kg", price: 4.0 },
  { id: "afi-5", af_id: "af-2", product_name: "Cenoura", qty: 150, unit: "kg", price: 3.2 },
  { id: "afi-6", af_id: "af-2", product_name: "Tomate", qty: 200, unit: "kg", price: 5.5 },
];

export const mockDivergences: Divergence[] = [
  {
    id: "div-1",
    nf_id: "nf-1",
    af_id: "af-1",
    field: "Quantidade - Arroz tipo 1",
    nf_value: "480 kg",
    af_value: "500 kg",
    severity: "critical",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "div-2",
    nf_id: "nf-2",
    af_id: "af-2",
    field: "Fornecedor",
    nf_value: "Hortifruti Brasil",
    af_value: "Hortifruti Brasil SA",
    severity: "warning",
    created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
];
