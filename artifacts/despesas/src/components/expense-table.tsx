import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Expense, Categoria, Status } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/formatters';
import { CATEGORIAS, STATUS } from '../lib/constants';
import { Edit2, Trash2 } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const [filterCategory, setFilterCategory] = useState<Categoria | 'Todas'>('Todas');
  const [filterStatus, setFilterStatus] = useState<Status | 'Todos'>('Todos');
  const [search, setSearch] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => filterCategory === 'Todas' || e.category === filterCategory)
      .filter(e => filterStatus === 'Todos' || e.status === filterStatus)
      .filter(e => search === '' || e.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, filterStatus, search]);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pendente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Cancelado': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Despesas</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <Input 
            placeholder="Buscar por descrição..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-1/3"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="flex h-10 w-full md:w-1/4 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="Todas">Todas Categorias</option>
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex h-10 w-full md:w-1/4 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="Todos">Todos Status</option>
            {STATUS.map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
        </div>
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
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma despesa encontrada.
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
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50" onClick={() => onEdit(expense)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50" onClick={() => onDelete(expense.id)}>
                          <Trash2 className="h-4 w-4" />
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
