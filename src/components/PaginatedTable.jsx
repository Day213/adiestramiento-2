import React, { useState } from 'react'
import { useSortableData } from './useSortableData'

/**
 * Componente de tabla paginada reutilizable
 * @param {Array} data - Datos a mostrar en la tabla
 * @param {Function} renderRow - Función que recibe un item y retorna un <tr>
 * @param {Array} columns - Array de objetos { label, key } para los encabezados
 * @param {number} rowsPerPage - Cantidad de filas por página (default: 10)
 */

export const PaginatedTable = ({ data, renderRow, columns, rowsPerPage = 10, pageState, setPageState }) => {
  // Permite control externo del estado de página si se provee, si no, usa interno
  const [internalPage, setInternalPage] = useState(1)
  const currentPage = pageState || internalPage
  const setCurrentPage = setPageState || setInternalPage
  const totalPages = Math.ceil(data.length / rowsPerPage)

  // Lógica de ordenamiento delegada al hook
  const sortableKeys = ['cantidad_asistente', 'fecha_aproximada', 'tipo_solicitud', 'created_at']
  const { sortedData, sortConfig, handleSort } = useSortableData(data, sortableKeys)

  const startIdx = (currentPage - 1) * rowsPerPage
  const endIdx = startIdx + rowsPerPage
  const pageData = sortedData.slice(startIdx, endIdx)

  // Icono de flecha para indicar orden
  const sortArrow = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div>
      {
        data.length > 0 ? (
          <div>
            <table className="bg-white p-2 rounded-lg min-w-full text-center">
              <thead>
                <tr className="text-slate-800">
                  {columns.map(col => {
                    const isSortable = sortableKeys.includes(col.key)
                    return (
                      <th
                        key={col.key}
                        className={`px-4 py-2 border-slate-300 border-b select-none text-nowrap ${isSortable ? 'cursor-pointer hover:text-blue-600' : ''}`}
                        onClick={isSortable ? () => handleSort(col.key, setCurrentPage) : undefined}
                      >
                        {col.label}
                        {isSortable && sortArrow(col.key)}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {pageData.map(renderRow)}
              </tbody>
            </table>
            {data.length > rowsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-slate-200 disabled:opacity-50 px-2 py-1 rounded">Anterior</button>
                <span className="mx-2">Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-slate-200 disabled:opacity-50 px-2 py-1 rounded">Siguiente</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <h2 className="font-bold text-slate-600 text-xl uppercase">No hay solicitudes en este momento</h2>
            <p className="mt-2 text-slate-600">Quizás hayan solicitudes pendientes, para asegurarte recarga la página</p>
          </div>
        )
      }
    </div>
  )
}
