import * as xlsx from 'xlsx';
import { Expense, ExportSummary } from './types';
import { formatCurrency, formatDate } from './formatters';

export const exportToExcel = (expenses: Expense[], summary: ExportSummary) => {
  const generatedAt = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const period = summary.dateFrom || summary.dateTo
    ? `${summary.dateFrom ? formatDate(summary.dateFrom) : 'início'} a ${summary.dateTo ? formatDate(summary.dateTo) : 'hoje'}`
    : 'Todos os períodos';

  const header = [
    ['Dashboard de Prestação de Contas'],
    ['Controle financeiro, despesas corporativas e relatórios gerenciais'],
    [`Gerado em: ${generatedAt}`],
    [`Período: ${period}`],
    [],
    ['RESUMO'],
    ['Total Geral', formatCurrency(summary.total)],
    ['Total Pago', formatCurrency(summary.pago)],
    ['Total Pendente', formatCurrency(summary.pendente)],
    ['Total Cancelado', formatCurrency(summary.cancelado)],
    [],
    ['LANÇAMENTOS'],
  ];

  const rows = expenses.map((e) => ({
    Data: formatDate(e.date),
    Descricao: e.description,
    Categoria: e.category,
    Valor: e.amount,
    Status: e.status,
  }));

  const ws = xlsx.utils.aoa_to_sheet(header);
  xlsx.utils.sheet_add_json(ws, rows, { origin: header.length, skipHeader: false });

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Despesas');
  xlsx.writeFile(wb, 'prestacao-de-contas.xlsx');
};

export const exportToPDF = (expenses: Expense[], summary: ExportSummary) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const generatedAt = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const period = summary.dateFrom || summary.dateTo
    ? `${summary.dateFrom ? formatDate(summary.dateFrom) : 'início'} até ${summary.dateTo ? formatDate(summary.dateTo) : 'hoje'}`
    : 'Todos os períodos';

  const rows = expenses
    .map(
      (e) => `
      <tr>
        <td>${formatDate(e.date)}</td>
        <td>${e.description}</td>
        <td>${e.category}</td>
        <td class="right">${formatCurrency(e.amount)}</td>
        <td><span class="badge badge-${e.status.toLowerCase()}">${e.status}</span></td>
      </tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Prestação de Contas</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 28px; }
        .header { border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; margin-bottom: 16px; }
        .header h1 { font-size: 18px; color: #1e3a5f; }
        .header p { color: #555; font-size: 11px; margin-top: 2px; }
        .meta { font-size: 11px; color: #666; margin-top: 6px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .summary-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
        .summary-card .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: .5px; }
        .summary-card .value { font-size: 14px; font-weight: bold; margin-top: 2px; }
        .value-total { color: #1e3a5f; }
        .value-pago { color: #16a34a; }
        .value-pendente { color: #d97706; }
        .value-cancelado { color: #64748b; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e3a5f; color: #fff; padding: 7px 10px; text-align: left; font-size: 11px; }
        td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        tr:nth-child(even) td { background: #f8fafc; }
        .right { text-align: right; }
        .badge { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
        .badge-pago { background: #dcfce7; color: #16a34a; }
        .badge-pendente { background: #fef3c7; color: #d97706; }
        .badge-cancelado { background: #f1f5f9; color: #64748b; }
        .total-row td { font-weight: bold; border-top: 2px solid #1e3a5f; border-bottom: none; background: #f8fafc; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Dashboard de Prestação de Contas</h1>
        <p>Controle financeiro, despesas corporativas e relatórios gerenciais</p>
        <p class="meta">Gerado em ${generatedAt} &nbsp;|&nbsp; Período: ${period} &nbsp;|&nbsp; ${expenses.length} lançamento(s)</p>
      </div>

      <div class="summary">
        <div class="summary-card">
          <div class="label">Total Geral</div>
          <div class="value value-total">${formatCurrency(summary.total)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Total Pago</div>
          <div class="value value-pago">${formatCurrency(summary.pago)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Total Pendente</div>
          <div class="value value-pendente">${formatCurrency(summary.pendente)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Total Cancelado</div>
          <div class="value value-cancelado">${formatCurrency(summary.cancelado)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="total-row">
            <td colspan="3">Total Geral</td>
            <td class="right">${formatCurrency(summary.total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); }, 300);
};
