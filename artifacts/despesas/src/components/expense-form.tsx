import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORIAS, STATUS } from '../lib/constants';
import { Expense, Categoria, Status } from '../lib/types';
import { parseAmount } from '../lib/formatters';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

export function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Categoria>('Alimentação');
  const [status, setStatus] = useState<Status>('Pendente');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setStatus(editingExpense.status);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onSubmit({
      description,
      amount: parseAmount(amount),
      category,
      status,
      date,
    });

    if (!editingExpense) {
      setDescription('');
      setAmount('');
      setCategory('Alimentação');
      setStatus('Pendente');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingExpense ? 'Editar Despesa' : 'Nova Despesa'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Almoço restaurante"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Categoria)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {STATUS.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            {editingExpense && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancelar
              </Button>
            )}
            <Button type="submit">
              {editingExpense ? 'Salvar Alterações' : 'Adicionar Despesa'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
