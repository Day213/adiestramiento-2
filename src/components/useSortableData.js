import { useState, useMemo } from "react";

/**
 * Hook para lógica de ordenamiento reutilizable
 * @param {Array} data - Datos a ordenar
 * @param {Array} sortableKeys - Claves que se pueden ordenar
 * @returns {Object} sortedData, sortConfig, handleSort
 */
export function useSortableData(data, sortableKeys = []) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // Si es cantidad_asistente, convertir a número
      if (sortConfig.key === "cantidad_asistente") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      // Si es fecha_aproximada, intentar parsear como fecha
      if (sortConfig.key === "fecha_aproximada") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key, resetPage) => {
    if (!sortableKeys.includes(key)) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    if (resetPage) resetPage(1);
  };

  return { sortedData, sortConfig, handleSort };
}
