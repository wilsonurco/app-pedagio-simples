import { useEffect, useMemo, useState } from 'react';

import { isFiscalTechEnabled } from '@/config/dataSource';
import { isPassagePayable } from '@/services/fiscaltech/mappers';
import { sumPassagesAmount, type Passage } from '@/data/mock';

function getSelectableIds(passages: Passage[]) {
  if (isFiscalTechEnabled()) {
    return passages.filter(isPassagePayable).map((passage) => passage.id);
  }
  return passages.map((passage) => passage.id);
}

export function usePassageSelection(pendingPassages: Passage[], initialSelected?: string[]) {
  const selectableIds = useMemo(() => getSelectableIds(pendingPassages), [pendingPassages]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialSelected?.length) {
      const ids = initialSelected.filter((id) => selectableIds.includes(id));
      return ids.length > 0 ? ids : selectableIds;
    }
    return selectableIds;
  });

  useEffect(() => {
    setSelectedIds((current) => {
      const stillValid = current.filter((id) => selectableIds.includes(id));
      if (stillValid.length === current.length && stillValid.length > 0) {
        return current;
      }
      if (initialSelected?.length) {
        const ids = initialSelected.filter((id) => selectableIds.includes(id));
        return ids.length > 0 ? ids : selectableIds;
      }
      return selectableIds;
    });
  }, [selectableIds.join(','), initialSelected?.join(',')]);

  const selectedPassages = useMemo(
    () => pendingPassages.filter((p) => selectedIds.includes(p.id)),
    [pendingPassages, selectedIds],
  );

  const total = sumPassagesAmount(selectedPassages);
  const allSelected = selectableIds.length > 0 && selectedIds.length === selectableIds.length;

  function getVisibleSelectableIds(visiblePassages: Passage[]) {
    return getSelectableIds(visiblePassages);
  }

  function allVisibleSelected(visiblePassages: Passage[]) {
    const visibleSelectable = getVisibleSelectableIds(visiblePassages);
    return visibleSelectable.length > 0 && visibleSelectable.every((id) => selectedIds.includes(id));
  }

  function toggleAllVisible(visiblePassages: Passage[]) {
    const visibleSelectable = getVisibleSelectableIds(visiblePassages);
    if (visibleSelectable.length === 0) return;

    setSelectedIds((current) => {
      const everySelected = visibleSelectable.every((id) => current.includes(id));
      if (everySelected) {
        return current.filter((id) => !visibleSelectable.includes(id));
      }
      return [...new Set([...current, ...visibleSelectable])];
    });
  }

  function togglePassage(id: string) {
    if (isFiscalTechEnabled()) {
      const passage = pendingPassages.find((item) => item.id === id);
      if (passage && !isPassagePayable(passage)) return;
    }

    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : selectableIds);
  }

  return {
    selectedIds,
    selectedPassages,
    total,
    allSelected,
    allVisibleSelected,
    togglePassage,
    toggleAll,
    toggleAllVisible,
  };
}
