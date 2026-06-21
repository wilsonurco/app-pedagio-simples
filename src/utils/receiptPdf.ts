import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import type { Passage } from '@/data/mock';

import { buildReceiptHtml, getReceiptFilename } from './receiptHtml';

async function createPdfFile(passage: Passage): Promise<string> {
  const html = buildReceiptHtml(passage);
  const { uri } = await Print.printToFileAsync({ html });
  const filename = getReceiptFilename(passage);
  const destination = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

function openWebPrint(html: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Não foi possível abrir a janela de impressão.');
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/** Compartilha o comprovante em PDF (share sheet no mobile, impressão no web). */
export async function shareReceiptPdf(passage: Passage): Promise<void> {
  const html = buildReceiptHtml(passage);

  if (Platform.OS === 'web') {
    openWebPrint(html);
    return;
  }

  const uri = await createPdfFile(passage);
  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error('Compartilhamento não disponível neste dispositivo.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Compartilhar comprovante',
  });
}

/** Baixa ou salva o comprovante em PDF. */
export async function downloadReceiptPdf(passage: Passage): Promise<void> {
  const html = buildReceiptHtml(passage);

  if (Platform.OS === 'web') {
    openWebPrint(html);
    return;
  }

  const uri = await createPdfFile(passage);
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Salvar comprovante',
    });
    return;
  }

  throw new Error('Download não disponível neste dispositivo.');
}
