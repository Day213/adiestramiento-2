
import React from 'react'
import { Layout } from '../components/layout'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabase'


export const ResponderSolicitud = () => {
  const { id } = useParams()
  const [solicitud, setSolicitud] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchSolicitud = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('id', id)
        .single()
      if (!error) setSolicitud(data)
      setLoading(false)
    }
    if (id) fetchSolicitud()
  }, [id])

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-[85vh]">
        {loading ? (
          <div className="text-slate-500">Cargando solicitud...</div>
        ) : solicitud ? (
          <>
            <h2 className="font-bold text-blue-600 text-2xl uppercase">Responder solicitud de {solicitud.tipo_solicitud}</h2>
            <div className="bg-white shadow-xl mt-4 p-6 rounded-lg w-md max-w-2xl text-left">
              <div className="mt-4 text-left">
                <label htmlFor="nombre" className="font-medium text-slate-400 text-sm">Correo</label>
                <input type="text" id="nombre" className="bg-slate-200 shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe tu nombre aquí..." value={solicitud.correo || ''} disabled />
              </div>
              <div className="mt-4 text-left">
                <label htmlFor="asunto" className="font-medium text-slate-700 text-sm">Asunto</label>
                <input
                  type="text"
                  id="asunto"
                  className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                  value={`Respuesta a la solicitud de '${solicitud.tipo_solicitud}' para ${solicitud.nombre_solicitante}`}
                  readOnly
                />
              </div>
              <div className="mt-4 text-left">
                <label htmlFor="respuesta" className="font-medium text-slate-700 text-sm">Tu respuesta</label>
                <textarea id="respuesta" rows="4" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full" placeholder="Escribe tu respuesta aquí..."></textarea>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link to="/listar-solicitudes">
                  <button className="bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-md font-bold text-slate-600 hover:text-white transition-all">
                    volver
                  </button>
                </Link>
                <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md font-bold text-white transition-all">Enviar Respuesta</button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-red-500">No se encontró la solicitud.</div>
        )}
      </div>
    </Layout>
  )
}
