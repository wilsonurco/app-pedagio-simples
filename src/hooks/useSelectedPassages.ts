import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { isPassagePayable } from '@/services/fiscaltech/mappers';
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

  const pendingSelectedIds = useMemo(() => {
    const pendingIds = new Set(pendingPassages.map((passage) => passage.id));
    return selectedIds.filter((id) => pendingIds.has(id));
  }, [selectedIds, pendingPassages]);

  const selectedPassages = useMemo(
    () => passages.filter((p) => selectedIds.includes(p.id)),
    [passages, selectedIds],
  );

  const payableSelectedPassages = useMemo(() => {
    if (!isFiscalTechEnabled()) {
      return selectedPassages.filter((passage) => passage.status === 'pending');
    }
    return selectedPassages.filter(isPassagePayable);
  }, [selectedPassages]);

  const total = sumPassagesAmount(
    isFiscalTechEnabled() ? payableSelectedPassages : selectedPassages.filter((p) => p.status === 'pending'),
  );

  return {
    selectedParam,
    selectedIds,
    pendingSelectedIds,
    selectedPassages,
    payableSelectedPassages,
    total,
    hasSelection: selectedIds.length > 0,
    canPay: isFiscalTechEnabled()
      ? payableSelectedPassages.length > 0
      : pendingSelectedIds.length > 0,
  };
}
