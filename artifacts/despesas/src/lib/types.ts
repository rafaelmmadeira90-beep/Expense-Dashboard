export type Categoria = 'Alimentação' | 'Transporte' | 'Moradia' | 'Saúde' | 'Lazer' | 'Educação' | 'Outros';
export type Status = 'Pendente' | 'Pago' | 'Cancelado';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Categoria;
  status: Status;
  date: string; // ISO string YYYY-MM-DD
}
