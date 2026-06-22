import { useEffect, useMemo, useState } from 'react';

import { sumPassagesAmount, type Passage } from '@/data/mock';

function getPendingIds(passages: Passage[]) {
  return passages.map((p) => p.id);
}

export function usePassageSelection(pendingPassages: Passage[], initialSelected?: string[]) {
  const pendingIds = useMemo(() => getPendingIds(pendingPassages), [pendingPassages]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialSelected?.length) {
      const ids = initialSelected.filter((id) => pendingIds.includes(id));
      return ids.length > 0 ? ids : pendingIds;
    }
    return pendingIds;
  });

  useEffect(() => {
    setSelectedIds((current) => {
      const stillValid = current.filter((id) => pendingIds.includes(id));
      if (stillValid.length === current.length && stillValid.length > 0) {
        return current;
      }
      if (initialSelected?.length) {
        const ids = initialSelected.filter((id) => pendingIds.includes(id));
        return ids.length > 0 ? ids : pendingIds;
      }
      return pendingIds;
    });
  }, [pendingIds.join(','), initialSelected?.join(',')]);

  const selectedPassages = useMemo(
    () => pendingPassages.filter((p) => selectedIds.includes(p.id)),
    [pendingPassages, selectedIds],
  );

  const total = sumPassagesAmount(selectedPassages);
  const allSelected = pendingIds.length > 0 && selectedIds.length === pendingIds.length;

  function togglePassage(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : pendingIds);
  }

  return {
    selectedIds,
    selectedPassages,
    total,
    allSelected,
    togglePassage,
    toggleAll,
  };
}
