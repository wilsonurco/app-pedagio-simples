import { formatBRL, passageTypeLabels, userProfile, type Passage } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string) {
  return `
    <tr>
      <td class="label">${escapeHtml(label)}</td>
      <td class="value">${escapeHtml(value)}</td>
    </tr>
  `;
}

export function generateReceiptId(passageId: string): string {
  return `CPV-${passageId.replace(/^PS-/, '')}`;
}

export function buildReceiptHtml(passage: Passage): string {
  const receiptId = passage.receiptId ?? generateReceiptId(passage.passageId);
  const locationDetail =
    passage.type === 'free-flow'
      ? `Pórtico: ${passage.gantry ?? '—'}`
      : `Faixa: ${passage.lane ?? '—'}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Comprovante ${escapeHtml(receiptId)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #111;
      background: #fff;
      padding: 32px 24px;
      line-height: 1.45;
    }
    .header {
      text-align: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid #5B2E8C;
    }
    .brand { color: #5B2E8C; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .doc-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .amount-box {
      background: #f7f4fa;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .amount-label { font-size: 13px; color: #666; margin-bottom: 6px; }
    .amount { font-size: 32px; font-weight: 700; color: #5B2E8C; }
    .status {
      display: inline-block;
      margin-top: 10px;
      padding: 4px 12px;
      border-radius: 999px;
      background: #e8f8ec;
      color: #1b7f3a;
      font-size: 12px;
      font-weight: 600;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    tr + tr td { border-top: 1px solid #eee; }
    td { padding: 10px 0; vertical-align: top; }
    .label { width: 42%; font-size: 12px; color: #888; padding-right: 12px; }
    .value { font-size: 14px; color: #111; font-weight: 500; }
    .section { margin-top: 22px; }
    .section-title {
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      font-size: 11px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">pedágio simples</div>
    <div class="doc-title">Comprovante de pagamento</div>
  </div>

  <div class="amount-box">
    <div class="amount-label">Valor pago</div>
    <div class="amount">${escapeHtml(formatBRL(passage.amount))}</div>
    <div class="status">Pagamento confirmado</div>
  </div>

  <div class="section">
    <div class="section-title">Comprovante</div>
    <table>
      ${row('Nº do comprovante', receiptId)}
      ${row('ID da passagem', passage.passageId)}
      ${row('Data do pagamento', formatDateTimeDisplay(passage.paidAt))}
      ${row('Forma de pagamento', passage.paymentMethod ?? '—')}
      ${passage.fiscalProtocol ? row('Protocolo FiscalTech', passage.fiscalProtocol) : ''}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Veículo</div>
    <table>
      ${row('Placa', passage.plate)}
      ${row('Modelo', passage.vehicleModel)}
      ${row('Titular', userProfile.name)}
    </table>
  </div>

  <div class="section">
    <div class="section-title">Passagem</div>
    <table>
      ${row('Local', passage.plaza)}
      ${row('Rodovia', passage.highway)}
      ${row('Tipo', passageTypeLabels[passage.type])}
      ${row('Concessionária', passage.concessionaire)}
      ${row('Quilometragem', passage.km)}
      ${row('Sentido', passage.direction)}
      ${row(passage.type === 'free-flow' ? 'Pórtico' : 'Faixa', passage.gantry ?? passage.lane ?? '—')}
      ${row('Data da passagem', formatDateTimeDisplay(passage.date))}
    </table>
  </div>

  <div class="footer">
    Documento emitido eletronicamente por Pedágio Simples.<br />
    ${escapeHtml(receiptId)} · ${escapeHtml(passage.passageId)}
  </div>
</body>
</html>`;
}

export function getReceiptFilename(passage: Passage): string {
  const receiptId = passage.receiptId ?? generateReceiptId(passage.passageId);
  return `${receiptId}.pdf`;
}
