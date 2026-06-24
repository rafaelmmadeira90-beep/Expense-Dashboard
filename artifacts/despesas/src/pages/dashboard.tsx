import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/use-expenses';
import { SummaryCards } from '../components/summary-cards';
import { ExpenseCharts } from '../components/expense-charts';
import { ExpenseForm } from '../components/expense-form';
import { ExpenseTable } from '../components/expense-table';
import { exportToExcel, exportToPDF } from '../lib/export-utils';
import { Button } from '@/components/ui/button';
import { Expense, FilterState, ExportSummary } from '../lib/types';
import { FileSpreadsheet, FileText, LayoutDashboard } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  category: 'Todas',
  status: 'Todos',
  dateFrom: '',
  dateTo: '',
  search: '',
};

export default function Dashboard() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => filters.category === 'Todas' || e.category === filters.category)
      .filter((e) => filters.status === 'Todos' || e.status === filters.status)
      .filter((e) => !filters.dateFrom || e.date >= filters.dateFrom)
      .filter((e) => !filters.dateTo || e.date <= filters.dateTo)
      .filter(
        (e) =>
          filters.search === '' ||
          e.description.toLowerCase().includes(filters.search.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filters]);

  const summary: ExportSummary = useMemo(() => ({
    total: filteredExpenses.reduce((s, e) => s + e.amount, 0),
    pago: filteredExpenses.filter((e) => e.status === 'Pago').reduce((s, e) => s + e.amount, 0),
    pendente: filteredExpenses.filter((e) => e.status === 'Pendente').reduce((s, e) => s + e.amount, 0),
    cancelado: filteredExpenses.filter((e) => e.status === 'Cancelado').reduce((s, e) => s + e.amount, 0),
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  }), [filteredExpenses, filters.dateFrom, filters.dateTo]);

  const handleSubmit = (expenseData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      setEditingExpense(null);
    } else {
      addExpense(expenseData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Dashboard de Prestação de Contas
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Controle financeiro, despesas corporativas e relatórios gerenciais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => exportToExcel(filteredExpenses, summary)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => exportToPDF(filteredExpenses, summary)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </header>

        <SummaryCards expenses={expenses} />

        <ExpenseForm
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />

        <ExpenseCharts expenses={expenses} />

        <ExpenseTable
          filteredExpenses={filteredExpenses}
          filters={filters}
          onFiltersChange={setFilters}
          onEdit={setEditingExpense}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
}
