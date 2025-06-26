import React from 'react'
import { Layout } from '../components/layout'
import { Mail } from '../../public/mail'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'


export const ListarSolicitud = () => {

  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <Layout>
      {
        loading ? ("cargando") : (
          <div className="bg-slate-100 shadow-xl p-4 rounded-md h-[83vh] overflow-y-auto">
            <table className="bg-white p-2 rounded-lg min-w-full text-center">
              <thead>
                <tr className="text-slate-800">
                  <th className="px-4 py-2 border-slate-300 border-b">Solicitud</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Solicitante</th>
                  <th className="px-4 py-2 border-slate-300 border-b">N° asistentes</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Fecha</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Tema</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Telefono</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Correo</th>
                  <th className="px-4 py-2 border-slate-300 border-b">Respuesta</th>
                </tr>
              </thead>
              <tbody>
                {
                  solicitudes.map((item) => (
                    <tr key={item.id} className="text-slate-500">
                      <td className="px-4 py-2 border-slate-300 border-b">
                        <span className="bg- bg-blue-800 p-1 rounded-md text-[10px] text-white uppercase">
                          {item.tipo_solicitud}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-slate-300 border-b font-bold text-slate-600 text-left">
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
                          <div className="flex justify-center items-center bg-slate-300 rounded-full text-white">
                            <span className="p-1 px-2 font-bold text-[10px] text-slate-600">{item.fecha_aproximada}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-slate-300 border-b text-xs">
                        {item.tema_solicitante}
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
                          <Link to={`/responder-solicitudes/${item.id}`}>
                            <button className="bg-slate-400 hover:bg-slate-700 p-1 px-3 rounded-md text-white transition-colors duration-200">
                              <Mail />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                }

              </tbody>
            </table>
          </div>
        )
      }
    </Layout>
  )
}


