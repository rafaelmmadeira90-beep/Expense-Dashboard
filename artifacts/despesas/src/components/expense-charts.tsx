import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '../lib/types';
import { formatCurrency } from '../lib/formatters';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#ec4899'];

export function ExpenseCharts({ expenses }: { expenses: Expense[] }) {
  // Category Data
  const categoryData = expenses.reduce((acc, curr) => {
    if (curr.status === 'Cancelado') return acc;
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Status Data
  const statusData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.status);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.status, value: curr.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despesas por Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `R$ ${value}`}
              />
              <RechartsTooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'transparent'}}/>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.name === 'Pago' ? '#10b981' : 
                    entry.name === 'Pendente' ? '#f59e0b' : 
                    '#94a3b8'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
