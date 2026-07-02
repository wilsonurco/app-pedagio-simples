import { formatBRL, passageTypeLabels, userProfile, type Passage } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { formatPassageIdNumeric } from '@/utils/passageId';

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

export function generateRpvId(passageId: string): string {
  return `RPV-${passageId.replace(/^PS-/, '')}`;
}

export function buildRpvHtml(passage: Passage): string {
  const rpvId = passage.rpvId ?? generateRpvId(passage.passageId);
  const passageIdDisplay = formatPassageIdNumeric(passage.passageId);
  const locationDetail =
    passage.type === 'free-flow'
      ? `Pórtico: ${passage.gantry ?? '—'}`
      : `Faixa: ${passage.lane ?? '—'}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RPV ${escapeHtml(rpvId)}</title>
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
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 2px solid #1a1a1a;
    }
    .concessionaire {
      font-size: 16px;
      font-weight: 700;
      color: #111;
      margin-bottom: 4px;
    }
    .brand { color: #5B2E8C; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
    .doc-title {
      font-size: 15px;
      font-weight: 700;
      color: #111;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .doc-subtitle { font-size: 12px; color: #666; margin-top: 4px; }
    .rpv-box {
      background: #f4f6f8;
      border: 1px solid #dde2e8;
      border-radius: 10px;
      padding: 16px 20px;
      margin: 20px 0;
      text-align: center;
    }
    .rpv-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.6px; }
    .rpv-id { font-size: 20px; font-weight: 700; color: #111; margin-top: 4px; font-variant-numeric: tabular-nums; }
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
    .legal {
      margin-top: 28px;
      padding: 14px 16px;
      background: #fafafa;
      border-left: 3px solid #5B2E8C;
      font-size: 11px;
      color: #555;
      line-height: 1.5;
    }
    .footer {
      margin-top: 24px;
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
    <div class="concessionaire">${escapeHtml(passage.concessionaire)}</div>
    <div class="brand">via Pedágio Simples</div>
    <div class="doc-title">Registro de Passagem Veicular</div>
    <div class="doc-subtitle">${escapeHtml(passage.highway)} · ${escapeHtml(locationDetail)}</div>
  </div>

  <div class="rpv-box">
    <div class="rpv-label">Nº do RPV</div>
    <div class="rpv-id">${escapeHtml(rpvId)}</div>
    <div class="status">Passagem quitada</div>
  </div>

  <div class="section">
    <div class="section-title">Identificação da passagem</div>
    <table>
      ${row('ID da passagem', passageIdDisplay)}
      ${row('Data e hora da passagem', formatDateTimeDisplay(passage.date))}
      ${row('Local', passage.plaza)}
      ${row('Rodovia', passage.highway)}
      ${row('Quilometragem', passage.km)}
      ${row('Sentido', passage.direction)}
      ${row('Tipo', passageTypeLabels[passage.type])}
      ${row(passage.type === 'free-flow' ? 'Pórtico' : 'Faixa', passage.gantry ?? passage.lane ?? '—')}
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
    <div class="section-title">Quitação</div>
    <table>
      ${row('Valor pago', formatBRL(passage.amount))}
      ${row('Data do pagamento', formatDateTimeDisplay(passage.paidAt))}
      ${row('Forma de pagamento', passage.paymentMethod ?? '—')}
      ${passage.receiptId ? row('Comprovante', passage.receiptId) : ''}
      ${passage.fiscalProtocol ? row('Protocolo de confirmação', passage.fiscalProtocol) : ''}
    </table>
  </div>

  <div class="legal">
    Este documento comprova o registro e a quitação da passagem veicular indicada acima,
    emitido eletronicamente pela concessionária ${escapeHtml(passage.concessionaire)} por
    intermédio da plataforma Pedágio Simples. Possui validade para fins de comprovação
    de pagamento e regularização de débitos de pedágio.
  </div>

  <div class="footer">
    Emitido em ${escapeHtml(formatDateTimeDisplay(passage.paidAt))}<br />
    ${escapeHtml(rpvId)} · Passagem ${escapeHtml(passageIdDisplay)}
  </div>
</body>
</html>`;
}

export function getRpvFilename(passage: Passage): string {
  const rpvId = passage.rpvId ?? generateRpvId(passage.passageId);
  return `${rpvId}.pdf`;
}
