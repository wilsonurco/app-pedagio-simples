/** Gera payload Pix Copia e Cola simulado para demonstração. */

import { merchantPix } from '@/data/mock';

function crc16(payload: string): string {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

export function generatePixEmvCode(options: {
  amount: number;
  pixKey?: string;
  merchantName?: string;
  city?: string;
  txId?: string;
}): string {
  const amount = options.amount.toFixed(2);
  const merchantName = (options.merchantName ?? merchantPix.name).slice(0, 25).toUpperCase();
  const city = (options.city ?? merchantPix.city).slice(0, 15).toUpperCase();
  const txId = (options.txId ?? `PS${Date.now().toString(36).toUpperCase()}`).slice(0, 25);
  const pixKey = options.pixKey ?? merchantPix.key;
  const merchantAccount = tlv('00', 'br.gov.bcb.pix') + tlv('01', pixKey);
  const additionalData = tlv('05', txId);

  const payload =
    tlv('00', '01') +
    tlv('26', merchantAccount) +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amount) +
    tlv('58', 'BR') +
    tlv('59', merchantName) +
    tlv('60', city) +
    tlv('62', additionalData) +
    '6304';

  return `${payload}${crc16(payload)}`;
}

export function maskPixKey(type: string, value: string): string {
  if (type === 'email') {
    const [user, domain] = value.split('@');
    if (!domain) return value;
    const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user.slice(0, 2)}***`;
    return `${maskedUser}@${domain}`;
  }

  if (type === 'cpf') {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return value;
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }

  if (type === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return value;
    return `(**) *****-${digits.slice(-4)}`;
  }

  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}
