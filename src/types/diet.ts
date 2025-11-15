export type DietBase = 
  | "Livre"
  | "Branda"
  | "Pastosa"
  | "Líquida Completa";

export type DietModifier = 
  | "Nenhuma"
  | "Hipossódica"
  | "DM 1800 kcal";

export type OrderStatus = 
  | "Novo"
  | "Em Preparo"
  | "Pronto"
  | "Entregue";

export interface Patient {
  id: string;
  name: string;
  room: string;
  sector: string;
  allergies?: string;
  currentDiet?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  room: string;
  sector: string;
  dietBase: DietBase;
  dietModifier: DietModifier;
  observations?: string;
  prescribedBy: string;
  prescribedAt: Date;
  meal: string;
}

export interface Order {
  id: string;
  prescriptionId: string;
  patientName: string;
  room: string;
  sector: string;
  diet: string;
  status: OrderStatus;
  createdAt: Date;
  startedAt?: Date;
  readyAt?: Date;
  deliveredAt?: Date;
  deliveredBy?: string;
  assignedTo?: string;
}
