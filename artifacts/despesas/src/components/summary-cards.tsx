import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '../lib/types';
import { formatCurrency } from '../lib/formatters';

interface SummaryCardsProps {
  expenses: Expense[];
}

export function SummaryCards({ expenses }: SummaryCardsProps) {
  const totalGeral = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalPago = expenses.filter(e => e.status === 'Pago').reduce((acc, e) => acc + e.amount, 0);
  const totalPendente = expenses.filter(e => e.status === 'Pendente').reduce((acc, e) => acc + e.amount, 0);
  const totalCancelado = expenses.filter(e => e.status === 'Cancelado').reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalGeral)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPago)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalPendente)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cancelado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{formatCurrency(totalCancelado)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
