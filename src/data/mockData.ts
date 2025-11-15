import { Patient, Order } from "@/types/diet";

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "João da Silva",
    room: "201-A",
    sector: "Enfermaria A",
    currentDiet: "Branda",
    allergies: "Nenhuma registrada"
  },
  {
    id: "2",
    name: "Maria Oliveira",
    room: "201-B",
    sector: "Enfermaria A",
    currentDiet: "Líquida Completa + Hipossódica"
  },
  {
    id: "3",
    name: "Carlos Pereira",
    room: "202-A",
    sector: "Enfermaria A"
  },
  {
    id: "4",
    name: "Ana Costa",
    room: "305-B",
    sector: "UTI",
    currentDiet: "Líquida Completa"
  },
  {
    id: "5",
    name: "Pedro Santos",
    room: "203-B",
    sector: "Enfermaria A",
    currentDiet: "Livre"
  },
  {
    id: "6",
    name: "Lucia Ferreira",
    room: "410-B",
    sector: "Pediatria",
    currentDiet: "DM 1800 kcal"
  },
  {
    id: "7",
    name: "Roberto Alves",
    room: "501-A",
    sector: "Saúde Mental",
    currentDiet: "Branda"
  },
  {
    id: "8",
    name: "Fernanda Lima",
    room: "204-A",
    sector: "Enfermaria A",
    currentDiet: "Pastosa + Hipossódica"
  }
];

export const mockOrders: Order[] = [
  {
    id: "1235",
    prescriptionId: "p1235",
    patientName: "Carlos Pereira",
    room: "202-A",
    sector: "Enfermaria A",
    diet: "Pastosa",
    status: "Novo",
    createdAt: new Date(Date.now() - 2 * 60000)
  },
  {
    id: "1234",
    prescriptionId: "p1234",
    patientName: "João da Silva",
    room: "201-A",
    sector: "Enfermaria A",
    diet: "Branda + Hipossódica",
    status: "Novo",
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    id: "1233",
    prescriptionId: "p1233",
    patientName: "Ana Costa",
    room: "305-B",
    sector: "UTI",
    diet: "Líquida Completa",
    status: "Novo",
    createdAt: new Date(Date.now() - 8 * 60000)
  },
  {
    id: "1229",
    prescriptionId: "p1229",
    patientName: "Roberto Alves",
    room: "501-A",
    sector: "Saúde Mental",
    diet: "Branda",
    status: "Em Preparo",
    createdAt: new Date(Date.now() - 15 * 60000),
    startedAt: new Date(Date.now() - 10 * 60000),
    assignedTo: "Equipe 1"
  },
  {
    id: "1220",
    prescriptionId: "p1220",
    patientName: "Lucia Ferreira",
    room: "410-B",
    sector: "Pediatria",
    diet: "DM 1800 kcal",
    status: "Pronto",
    createdAt: new Date(Date.now() - 25 * 60000),
    startedAt: new Date(Date.now() - 20 * 60000),
    readyAt: new Date(Date.now() - 5 * 60000)
  }
];
