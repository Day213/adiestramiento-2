import React from 'react'
import { Layout } from '../components/layout'
import { Mail } from '../../public/mail'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

import { Tab } from '@headlessui/react'
import { PaginatedTable } from '../components/PaginatedTable'



export const ListarSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  // Estados de página independientes para cada tabla
  const [pagePendientes, setPagePendientes] = useState(1)
  const [pageRespondidas, setPageRespondidas] = useState(1)

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('solicitudes').select('*')
      if (!error) setSolicitudes(data)
      setLoading(false)
    }
    fetchSolicitudes()
  }, [])

  console.log(solicitudes)

  const solicitudesActivas = solicitudes.filter(s => s.status === true)
  const solicitudesRespondidas = solicitudes.filter(s => s.status === false)
  const columns = [
    { label: 'Solicitud', key: 'tipo_solicitud' },
    { label: 'Solicitante', key: 'nombre_solicitante' },
    { label: 'N° asistentes', key: 'cantidad_asistente' },
    { label: 'Fecha aproximada', key: 'fecha_aproximada' },
    { label: 'Tema', key: 'tema_solicitante' },
    { label: 'Telefono', key: 'telefono' },
    { label: 'Correo', key: 'correo' },
    { label: 'Fecha creación', key: 'created_at' },
    { label: 'Respuesta', key: 'respuesta' },
  ]

  const renderRow = (item) => {
    const fechaCorta = item.created_at
      ? new Date(item.created_at).toISOString().slice(0, 10)
      : ''

    // Verificar si hay más de una solicitud con la misma fecha_aproximada
    const fechaIgual = solicitudes.filter(s => s.fecha_aproximada === item.fecha_aproximada).length > 1
    return (
      <tr key={item.id} className="text-slate-500">
        <td className="px-4 py-2 border-slate-300 border-b">
          <span className={`${item.tipo_solicitud === 'taller' ? 'bg-blue-800' : 'bg-amber-400 text-black!'} p-1 rounded-md text-[10px] text-white uppercase`}>
            {item.tipo_solicitud}
          </span>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b font-bold text-slate-600 text-left text-nowrap">
          {item.nombre_solicitante}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center bg-slate-400 rounded-full w-6 h-5 text-white">
              <span className="font-bold text-[10px]">{item.cantidad_asistente}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          <div className="flex justify-center items-center">
            <div className={`flex justify-center items-center rounded-full text-white ${fechaIgual ? 'bg-amber-400' : 'bg-slate-300'}`}>
              <span className={`p-1 px-2 font-bold text-[10px] text-slate-600 text-nowrap ${fechaIgual ? 'text-black' : ''}`}>{item.fecha_aproximada}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 border-slate-300 border-b text-xs">
          <span className="h-[20px] line-clamp-1">{item.tema_solicitante}</span>
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
          <div className="flex justify-center items-center">
            <Link to={`/responder-solicitudes/${item.id}`}>
              <button className="bg-slate-400 hover:bg-slate-700 p-1 px-3 rounded-md text-white transition-colors duration-200">
                <Mail />
              </button>
            </Link>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <Layout>
      {
        loading ? ("cargando") : (
          <div className="bg-blue-50 shadow-xl p-4 rounded-md h-[83vh] overflow-y-auto">
            <div className="mb-4 font-semibold text-blue-900">
            </div>
            <Tab.Group>
              <Tab.List className="flex space-x-1 bg-blue-900/20 mb-4 p-1 rounded-xl">
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm leading-5 font-medium text-slate-700 rounded-lg
                    ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }
                >
                  SOLICITUDES PENDIENTES ({solicitudesActivas.length})
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm leading-5 font-medium text-slate-700 rounded-lg
                    ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                  }
                >
                  SOLICITUDES RESPONDIDAS
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <PaginatedTable
                    data={solicitudesActivas}
                    renderRow={renderRow}
                    columns={columns}
                    rowsPerPage={10}
                    pageState={pagePendientes}
                    setPageState={setPagePendientes}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <PaginatedTable
                    data={solicitudesRespondidas}
                    renderRow={renderRow}
                    columns={columns}
                    rowsPerPage={10}
                    pageState={pageRespondidas}
                    setPageState={setPageRespondidas}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        )
      }
    </Layout>
  )
}


