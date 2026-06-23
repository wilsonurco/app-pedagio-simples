import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    }

    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}
