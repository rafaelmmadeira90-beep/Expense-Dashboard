import * as xlsx from 'xlsx';
import { Expense } from './types';
import { formatCurrency, formatDate } from './formatters';

export const exportToExcel = (expenses: Expense[]) => {
  const data = expenses.map((e) => ({
    Data: formatDate(e.date),
    Descricao: e.description,
    Categoria: e.category,
    Valor: e.amount,
    Status: e.status,
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Despesas');
  xlsx.writeFile(workbook, 'despesas.xlsx');
};

export const exportToPDF = (expenses: Expense[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const rows = expenses
    .map(
      (e) => `
      <tr>
        <td>${formatDate(e.date)}</td>
        <td>${e.description}</td>
        <td>${e.category}</td>
        <td style="text-align:right">${formatCurrency(e.amount)}</td>
        <td>${e.status}</td>
      </tr>`
    )
    .join('');

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Relatorio de Despesas</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; margin: 24px; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        p.subtitle { color: #555; margin-bottom: 16px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e3a5f; color: #fff; padding: 8px 10px; text-align: left; font-size: 12px; }
        td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        tr:nth-child(even) td { background: #f8fafc; }
        .total-row td { font-weight: bold; border-top: 2px solid #1e3a5f; border-bottom: none; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>Relatorio de Despesas</h1>
      <p class="subtitle">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      <table>
        <thead>
          <tr>
            <th>Data</th><th>Descricao</th><th>Categoria</th><th>Valor</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="total-row">
            <td colspan="3">Total Geral</td>
            <td style="text-align:right">${formatCurrency(total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
};
