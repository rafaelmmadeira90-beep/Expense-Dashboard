import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Expense, FilterState, Categoria, Status } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/formatters';
import { CATEGORIAS, STATUS } from '../lib/constants';
import { Edit2, Trash2, X } from 'lucide-react';

interface ExpenseTableProps {
  filteredExpenses: Expense[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const selectCls = 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Pago': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Pendente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Cancelado': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    default: return '';
  }
};

export function ExpenseTable({ filteredExpenses, filters, onFiltersChange, onEdit, onDelete }: ExpenseTableProps) {
  const set = (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch });

  const hasActiveFilters =
    filters.category !== 'Todas' ||
    filters.status !== 'Todos' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.search !== '';

  const clearFilters = () =>
    onFiltersChange({ category: 'Todas', status: 'Todos', dateFrom: '', dateTo: '', search: '' });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Histórico de Lançamentos</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground gap-1">
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3">
          <Input
            placeholder="Buscar por descrição..."
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="lg:col-span-2"
          />

          <select
            value={filters.category}
            onChange={(e) => set({ category: e.target.value as Categoria | 'Todas' })}
            className={selectCls}
          >
            <option value="Todas">Todas as categorias</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => set({ status: e.target.value as Status | 'Todos' })}
            className={selectCls}
          >
            <option value="Todos">Todos os status</option>
            {STATUS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => set({ dateFrom: e.target.value })}
              title="Data inicial"
              className={`${selectCls} flex-1`}
            />
            <span className="text-muted-foreground text-sm shrink-0">até</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => set({ dateTo: e.target.value })}
              title="Data final"
              className={`${selectCls} flex-1`}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <p className="text-xs text-muted-foreground pt-1">
            {filteredExpenses.length} lançamento(s) encontrado(s) com os filtros aplicados.
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum lançamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="group">
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-0 font-medium ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                          onClick={() => onEdit(expense)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50"
                          onClick={() => onDelete(expense.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
