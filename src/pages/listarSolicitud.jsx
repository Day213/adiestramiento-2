import React from "react"
import { Layout } from "../components/layout"
import { FileText } from "../../public/fileText"
import { Trash } from "../../public/trash"


import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { useNavigate, useSearchParams } from "react-router"
import { Tab } from "@headlessui/react"
import { PaginatedTable } from "../components/PaginatedTable"
import { CourseActionsDropdown } from "./components/CourseActionsDropdown"

export const ListarSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [cursosYTalleres, setCursosYTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const [cursosYTalleresPage, setCursosYTalleresPage] = useState(1)
  const [pagePendientes, setPagePendientes] = useState(1)
  const [isDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams({ tab: 'solicitudes' })
  const activeTab = searchParams.get('tab') || 'solicitudes'

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setDeletingId(id)
      const { error } = await supabase
        .from('solicitudes')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update the state to remove the deleted item
      setSolicitudes(solicitudes.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Error al eliminar la solicitud. Por favor intente de nuevo.')
    } finally {
      setDeletingId(null)
    }
  }


  const handleDeleteCurso = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso/taller? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setDeletingId(id)
      const { error } = await supabase
        .from('cursos_talleres')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update the state to remove the deleted item
      setCursosYTalleres(cursosYTalleres.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting request:', error)
      alert('Error al eliminar la solicitud. Por favor intente de nuevo.')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("solicitudes").select("*")
      if (!error) setSolicitudes(data)
      setLoading(false)
    }
    const fetchCursosYTalleres = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("cursos_talleres").select("*").order('fecha_emision', { ascending: false })

      if (!error) setCursosYTalleres(data)
      setLoading(false)
    }

    fetchSolicitudes()
    fetchCursosYTalleres()
  }, [])

  const solicitudesActivas = solicitudes.filter((s) => s.status === true)
  const solicitudesRespondidas = solicitudes.filter((s) => s.status === false)
  const columns = [
    { label: "Solicitud", key: "tipo_solicitud" },
    { label: "Solicitante", key: "nombre_solicitante" },
    { label: "N° asistentes", key: "cantidad_asistente" },
    { label: "Fecha aproximada", key: "fecha_aproximada" },
    { label: "Tema", key: "tema_solicitante" },
    { label: "Telefono", key: "telefono" },
    { label: "Correo", key: "correo" },
    { label: "Fecha creación", key: "created_at" },
    { label: "Acciones", key: "acciones" },
  ]

  const columnsCursosYTalleres = [
    { label: "Curso/Taller", key: "titulo" },
    { label: "Duración", key: "tiempo" },
    { label: "Fecha de emisión", key: "fecha_emision" },
    { label: "Instructor", key: "dictado_por" },
    { label: "Temas", key: "temas" },
    { label: "Visible", key: "estatus" },
    { label: "Acciones", key: "acciones" },
  ]


  const navigate = useNavigate()

  const renderRowSolicitud = (item) => {
    const fechaCorta = item.created_at
      ? new Date(item.created_at).toISOString().slice(0, 10)
      : ""
    const fechaIgual =
      solicitudes.filter((s) => s.fecha_aproximada === item.fecha_aproximada)
        .length > 1
    return (
      <tr key={item.id} className="text-slate-500">
        <td className="px-4 py-2 border-slate-300 border-b">
          <span
            className={`${item.tipo_solicitud === "taller"
              ? "bg-blue-800"
              : "bg-amber-400 text-black!"
              } p-1 rounded-md text-[10px] text-white uppercase`}
          >
            {item.tipo_solicitud}
          </span>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b font-bold text-slate-600 text-left text-nowrap">
          {item.nombre_solicitante}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-slate-400 rounded-full w-6 h-5 text-white">
              <span className="font-bold text-[10px]">
                {item.cantidad_asistente}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div
              className={`flex justify-center items-center rounded-full text-white ${fechaIgual ? "bg-amber-400" : "bg-slate-300"
                }`}
            >
              <span
                className={`p-1 px-2 font-bold text-[10px] text-slate-600 text-nowrap ${fechaIgual ? "text-black" : ""
                  }`}
              >
                {item.fecha_aproximada}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b text-xs">
          <span
            className="group relative h-[20px] line-clamp-1 cursor-pointer"
            title={item.tema_solicitante}
          >
            {item.tema_solicitante}
            {/* Tooltip personalizado */}
            <span className="bottom-full left-1/2 z-10 absolute bg-slate-800 opacity-0 group-hover:opacity-100 mb-2 px-2 py-1 rounded w-max max-w-xs text-white text-xs whitespace-pre-line transition-opacity -translate-x-1/2 duration-200 pointer-events-none">
              {item.tema_solicitante}
            </span>
          </span>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-slate-300 rounded-full text-white">
              <span className="p-1 px-2 font-bold text-[10px] text-slate-600">
                {item.telefono}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-slate-300 rounded-full text-white">
              <span className="p-1 px-2 font-bold text-[10px] text-slate-600">
                {item.correo}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-slate-300 rounded-full text-white">
              <span className="p-1 px-2 font-bold text-[10px] text-slate-600">
                {fechaCorta}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center gap-2">

            <button onClick={() => navigate(`/crear-certificado/${item.id}-solicitudes`)} className="bg-slate-400 hover:bg-slate-700 p-1 px-3 rounded-md text-white transition-colors duration-200">
              <FileText />
            </button>

            <button
              onClick={() => handleDelete(item.id)}
              disabled={isDeleting && deletingId === item.id}
              className={`p-1 px-3 rounded-md text-white transition-colors duration-200 ${isDeleting && deletingId === item.id
                ? 'bg-red-700 cursor-not-allowed'
                : 'bg-red-400 hover:bg-red-700'
                }`}
            >
              {isDeleting && deletingId === item.id ? 'Eliminando...' : <Trash />}
            </button>
          </div>
        </td>
      </tr>
    )
  }

  const handleChangeEstatus = async (id, currentStatus) => {
    if (!window.confirm('¿Estás seguro de cambiar la visibilidad de este curso o taller? Si lo desactivas, no se mostrará en la parte pública de la web. Si lo activas, se hará visible.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cursos_talleres')
        .update({ estatus: !currentStatus })
        .eq('id', id)

      if (error) throw error

      // Update the state to reflect the new status
      setCursosYTalleres(cursosYTalleres.map(item =>
        item.id === id ? { ...item, estatus: !currentStatus } : item
      ))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error al cambiar el estado. Por favor intente de nuevo.')
    }
  }


  const renderRowCursoYTaller = (item) => {
    const fechaCorta = item.created_at
      ? new Date(item.created_at).toISOString().slice(0, 10)
      : ''
    return (
      <tr key={item.id} className="text-slate-500">
        <td className="px-4 py-2 border-slate-300 border-b text-left"><span className="max-w-[300px] line-clamp-1">{item.titulo}</span></td>
        <td className="px-4 py-2 border-slate-300 border-b">{item.tiempo} {item.tipo_tiempo}</td>
        <td className="px-4 py-2 border-slate-300 border-b">
          {
            (() => {
              const today = new Date()
              const emissionDate = new Date(item.fecha_emision)

              today.setHours(0, 0, 0, 0)
              emissionDate.setHours(0, 0, 0, 0)

              let dateClass = 'bg-slate-400' // Default to gray
              let dateInfo = ''

              if (emissionDate.toDateString() === today.toDateString()) {
                dateClass = 'bg-orange-400' // Today
                dateInfo = " (Hoy)"
              } else if (emissionDate < today) {
                dateClass = 'bg-slate-400' // Past date
                const diffTime = Math.abs(emissionDate.getTime() - today.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                dateInfo = ` (Hace ${diffDays} días)`
              } else {
                const oneWeekFromNow = new Date(today)
                oneWeekFromNow.setDate(today.getDate() + 7)

                const diffTime = Math.abs(emissionDate.getTime() - today.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                if (emissionDate <= oneWeekFromNow) {
                  dateClass = 'bg-blue-400' // Less than a week away
                  dateInfo = ` (Faltan ${diffDays} días)`
                } else {
                  dateClass = 'bg-slate-400' // More than a week away (default gray)
                  dateInfo = ` (Faltan ${diffDays} días)` // Still show days for future dates
                }
              }

              return (
                <span className={`p-1 px-2 font-bold text-[10px] rounded-full text-white ${dateClass}`}>
                  {dateInfo}
                </span>
              )
            })()
          }
        </td>
        <td className="px-4 py-2 border-slate-300 border-b capitalize"><span className="max-w-[200px] line-clamp-1">{item.dictado_por}</span></td>
        <td className="px-4 py-2 border-slate-300 border-b">{item.temas.length}</td>
        <td className="px-4 py-2 border-slate-300 border-b">{item.estatus ? 'Si' : 'No'}</td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <CourseActionsDropdown item={item} handleChangeEstatus={handleChangeEstatus} handleDeleteCurso={handleChangeEstatus} isDeleting={isDeleting} deletingId={deletingId} />
        </td>
      </tr>
    )
  }

  return (
    <Layout>
      {loading ? (
        "cargando"
      ) : (
        <div className="bg-blue-50 shadow-xl p-4 rounded-md h-[83vh] overflow-y-auto">
          <div className="mb-4 font-semibold text-blue-900"></div>
          <Tab.Group 
            defaultIndex={activeTab === 'solicitudes' ? 0 : 1}
            onChange={(index) => {
              setSearchParams({ tab: index === 0 ? 'solicitudes' : 'cursos' })
            }}
          >
            <Tab.List className="flex space-x-1 bg-blue-900/20 mb-4 p-1 rounded-xl">
              <Tab
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-medium text-slate-700 rounded-lg
                    ${selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                SOLICITUDES PENDIENTES ({solicitudesActivas.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-medium text-slate-700 rounded-lg
                    ${selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                LISTA DE CURSOS Y TALLERES ({cursosYTalleres.length})
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <PaginatedTable
                  data={solicitudesActivas}
                  renderRow={renderRowSolicitud}
                  columns={columns}
                  rowsPerPage={10}
                  pageState={pagePendientes}
                  setPageState={setPagePendientes}
                />
              </Tab.Panel>
              <Tab.Panel>
                <PaginatedTable
                  data={cursosYTalleres}
                  renderRow={renderRowCursoYTaller}
                  columns={columnsCursosYTalleres}
                  rowsPerPage={10}
                  pageState={cursosYTalleresPage}
                  setPageState={setCursosYTalleresPage}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </Layout>
  )
}
