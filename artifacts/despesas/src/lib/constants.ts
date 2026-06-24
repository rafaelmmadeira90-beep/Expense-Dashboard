import { Expense, Categoria, Status } from './types';

export const CATEGORIAS: Categoria[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Imóvel',
  'Outros',
];

export const STATUS: Status[] = ['Pendente', 'Pago', 'Cancelado'];

export const INITIAL_EXPENSES: Expense[] = [];
