import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

import { formatBRL, type Passage } from '@/data/mock';

import { buildReceiptHtml, getReceiptFilename } from './receiptHtml';

async function createPdfFile(passage: Passage): Promise<string> {
  const html = buildReceiptHtml(passage);
  const { uri } = await Print.printToFileAsync({ html });
  const filename = getReceiptFilename(passage);
  const destination = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

function printReceiptHtml(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Ambiente não suportado.'));
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'style',
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden',
    );
    document.body.appendChild(iframe);

    const frameWindow = iframe.contentWindow;
    const doc = iframe.contentDocument ?? frameWindow?.document;

    if (!doc || !frameWindow) {
      iframe.remove();
      reject(new Error('Não foi possível preparar o comprovante.'));
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    window.setTimeout(() => {
      try {
        frameWindow.focus();
        frameWindow.print();
        resolve();
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Falha ao abrir impressão.'));
      } finally {
        window.setTimeout(() => iframe.remove(), 1000);
      }
    }, 300);
  });
}

function downloadReceiptHtmlFile(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\.pdf$/i, '.html');
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function shareReceiptOnWeb(html: string, passage: Passage): Promise<void> {
  const receiptId = passage.receiptId ?? getReceiptFilename(passage).replace('.pdf', '');
  const filename = getReceiptFilename(passage).replace(/\.pdf$/i, '.html');
  const file = new File([html], filename, { type: 'text/html' });

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const shareData = {
        title: `Comprovante ${receiptId}`,
        text: `Comprovante de pagamento — ${formatBRL(passage.amount)}`,
        files: [file],
      };

      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
    }

    try {
      await navigator.share({
        title: `Comprovante ${receiptId}`,
        text: `Comprovante de pagamento — ${formatBRL(passage.amount)}`,
      });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
    }
  }

  await printReceiptHtml(html);
}

async function downloadReceiptOnWeb(html: string, passage: Passage): Promise<void> {
  try {
    await printReceiptHtml(html);
  } catch {
    downloadReceiptHtmlFile(html, getReceiptFilename(passage));
  }
}

/** Compartilha o comprovante em PDF (share sheet no mobile, share/impressão no web). */
export async function shareReceiptPdf(passage: Passage): Promise<void> {
  const html = buildReceiptHtml(passage);

  if (Platform.OS === 'web') {
    await shareReceiptOnWeb(html, passage);
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
    await downloadReceiptOnWeb(html, passage);
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

export function reportReceiptActionError(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}
