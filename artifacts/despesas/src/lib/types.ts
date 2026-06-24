export type Categoria = 'Alimentação' | 'Transporte' | 'Moradia' | 'Saúde' | 'Lazer' | 'Educação' | 'Imóvel' | 'Outros';
export type Status = 'Pendente' | 'Pago' | 'Cancelado';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Categoria;
  status: Status;
  date: string;
}

export interface FilterState {
  category: Categoria | 'Todas';
  status: Status | 'Todos';
  dateFrom: string;
  dateTo: string;
  search: string;
}

export interface ExportSummary {
  total: number;
  pago: number;
  pendente: number;
  cancelado: number;
  dateFrom?: string;
  dateTo?: string;
}
