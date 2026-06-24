import { Expense, Categoria, Status } from './types';

export const CATEGORIAS: Categoria[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Lazer',
  'Educação',
  'Outros',
];

export const STATUS: Status[] = ['Pendente', 'Pago', 'Cancelado'];

export const INITIAL_EXPENSES: Expense[] = [
  { id: '1', description: 'Mercado Mensal', amount: 850.45, category: 'Alimentação', status: 'Pago', date: '2023-10-05' },
  { id: '2', description: 'Conta de Luz', amount: 185.30, category: 'Moradia', status: 'Pago', date: '2023-10-10' },
  { id: '3', description: 'Uber para Reunião', amount: 45.00, category: 'Transporte', status: 'Pendente', date: '2023-10-12' },
  { id: '4', description: 'Plano de Saúde', amount: 450.00, category: 'Saúde', status: 'Pago', date: '2023-10-15' },
  { id: '5', description: 'Cinema', amount: 120.00, category: 'Lazer', status: 'Pago', date: '2023-10-20' },
  { id: '6', description: 'Curso de React', amount: 350.00, category: 'Educação', status: 'Pendente', date: '2023-10-22' },
  { id: '7', description: 'Manutenção Carro', amount: 600.00, category: 'Transporte', status: 'Cancelado', date: '2023-10-25' },
  { id: '8', description: 'Restaurante Fim de Semana', amount: 190.50, category: 'Alimentação', status: 'Pendente', date: '2023-10-28' },
  { id: '9', description: 'Aluguel', amount: 2100.00, category: 'Moradia', status: 'Pendente', date: '2023-11-01' },
];
