import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { usePassages } from '@/context/PassagesContext';
import { sumPassagesAmount } from '@/data/mock';

export function useSelectedPassages() {
  const { selected: selectedParam } = useLocalSearchParams<{ selected?: string }>();
  const { passages, pendingPassages } = usePassages();

  const selectedIds = useMemo(() => {
    if (!selectedParam) return [];
    const ids = selectedParam.split(',').filter(Boolean);
    const knownIds = new Set(passages.map((p) => p.id));
    return ids.filter((id) => knownIds.has(id));
  }, [selectedParam, passages]);

  const pendingSelectedIds = useMemo(
    () => selectedIds.filter((id) => pendingPassages.some((p) => p.id === id)),
    [selectedIds, pendingPassages],
  );

  const selectedPassages = useMemo(
    () => passages.filter((p) => selectedIds.includes(p.id)),
    [passages, selectedIds],
  );

  const total = sumPassagesAmount(selectedPassages);

  return {
    selectedParam,
    selectedIds,
    pendingSelectedIds,
    selectedPassages,
    total,
    hasSelection: selectedIds.length > 0,
    canPay: pendingSelectedIds.length > 0,
  };
}
