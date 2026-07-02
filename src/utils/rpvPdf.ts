import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

import { formatBRL, type Passage } from '@/data/mock';

import { buildRpvHtml, generateRpvId, getRpvFilename } from './rpvHtml';

async function createPdfFile(passage: Passage): Promise<string> {
  const html = buildRpvHtml(passage);
  const { uri } = await Print.printToFileAsync({ html });
  const filename = getRpvFilename(passage);
  const destination = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

function printRpvHtml(html: string): Promise<void> {
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
      reject(new Error('Não foi possível preparar o RPV.'));
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

function downloadRpvHtmlFile(html: string, filename: string) {
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

async function shareRpvOnWeb(html: string, passage: Passage): Promise<void> {
  const rpvId = passage.rpvId ?? generateRpvId(passage.passageId);
  const filename = getRpvFilename(passage).replace(/\.pdf$/i, '.html');
  const file = new File([html], filename, { type: 'text/html' });

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const shareData = {
        title: `RPV ${rpvId}`,
        text: `Registro de Passagem Veicular — ${formatBRL(passage.amount)}`,
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
        title: `RPV ${rpvId}`,
        text: `Registro de Passagem Veicular — ${formatBRL(passage.amount)}`,
      });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
    }
  }

  await printRpvHtml(html);
}

async function downloadRpvOnWeb(html: string, passage: Passage): Promise<void> {
  try {
    await printRpvHtml(html);
  } catch {
    downloadRpvHtmlFile(html, getRpvFilename(passage));
  }
}

/** Compartilha o RPV em PDF (share sheet no mobile, share/impressão no web). */
export async function shareRpvPdf(passage: Passage): Promise<void> {
  const html = buildRpvHtml(passage);

  if (Platform.OS === 'web') {
    await shareRpvOnWeb(html, passage);
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
    dialogTitle: 'Compartilhar RPV',
  });
}

/** Baixa ou salva o RPV em PDF. */
export async function downloadRpvPdf(passage: Passage): Promise<void> {
  const html = buildRpvHtml(passage);

  if (Platform.OS === 'web') {
    await downloadRpvOnWeb(html, passage);
    return;
  }

  const uri = await createPdfFile(passage);
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Salvar RPV',
    });
    return;
  }

  throw new Error('Download não disponível neste dispositivo.');
}

export function reportRpvActionError(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}
