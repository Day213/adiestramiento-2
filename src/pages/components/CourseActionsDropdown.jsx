import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from '../../../public/fileText'
import { Trash } from '../../../public/trash'
import { Edit } from '../../../public/edit'
import { View } from '../../../public/view'
import { Eye } from '../../../public/eye'
import { Eyeoff } from '../../../public/eye-off'

export const CourseActionsDropdown = ({ item, handleChangeEstatus, handleDeleteCurso, isDeleting, deletingId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="inline-block relative text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 w-full font-medium text-gray-700 text-sm"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          Acciones
          <svg className="-mr-1 ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="right-0 z-10 absolute bg-white ring-opacity-5 shadow-lg mt-2 rounded-md focus:outline-none ring-1 ring-black w-56 origin-top-right"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => { toggleDropdown(); navigate(`/crear-certificado/${item.id}-cursosytalleres`) }}
              className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left uppercase"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
            >
              <FileText className="inline-block mr-2" /> Crear Certificado
            </button>
            <button
              onClick={() => { toggleDropdown(); navigate(`/ver-curso-taller/${item.id}`) }} // Asumiendo una ruta para ver detalles
              className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left uppercase"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-2"
            >
              <View className="inline-block mr-2" /> Ver Detalles
            </button>

            <button
              onClick={() => { toggleDropdown(); handleChangeEstatus(item.id, item.estatus) }}
              className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left uppercase"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-3"
            >
              {item.estatus ? <Eyeoff /> : <Eye />} {item.estatus ? "Desactivar" : "Activar"} Visibilidad
            </button>

            <button
              onClick={() => { toggleDropdown(); navigate(`/editar-curso-taller/${item.id}`) }}
              className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 w-full text-amber-500 text-sm text-left uppercase"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-1"
            >
              <Edit className="inline-block mr-2" /> Editar Curso/Taller
            </button>

            <button
              onClick={() => { toggleDropdown(); handleDeleteCurso(item.id) }}
              className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 w-full text-red-600 text-sm text-left uppercase"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-4"
            >
              <Trash className="inline-block mr-2" /> Eliminar Curso/Taller
            </button>
          </div>
        </div>
      )}
    </div>
  )
}