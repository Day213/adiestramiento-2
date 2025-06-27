
import React, { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { Layout } from '../components/layout'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabase'


export const ResponderSolicitud = () => {
  const { id } = useParams()
  const [solicitud, setSolicitud] = React.useState(null)
  const [asunto, setAsunto] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [sending, setSending] = React.useState(false)


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



  const updateStatus = async () => {
    const { error } = await supabase
      .from('solicitudes')
      .update({ status: false })
      .eq('id', id)
    if (error) {
      console.error('Error actualizando status:', error)
    }
    setSending(false)
  }


  const form = useRef()

  const sendEmail = (e) => {
    setSending(true)
    e.preventDefault()
    emailjs
      .sendForm('service_pme297l', 'template_2rto3c5', form.current, {
        publicKey: 'Yg8bKBL0r2ENXrQ3Y',
      })
      .then(
        () => {
          updateStatus()
        },
        (error) => {
          console.log('FAILED...', error.text)
          setSending(false)
        },
      )
    setTimeout(() => {
      setSending(false)
    }, 1000)
  }
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-[85vh]">
        {loading ? (
          <div className="text-slate-500">Cargando solicitud...</div>
        ) : solicitud ? (
          <form ref={form} onSubmit={sendEmail}>
            <div className="text-center">
              {
                sending ? (
                  <div>
                    <h2 className="font-bold text-slate-600 text-xl uppercase">
                      No salga de la página
                    </h2>
                    <p className="mt-2 text-slate-400">
                      hasta que termine el proceso de enviar la respuesta.
                    </p>
                  </div>
                ) : (
                  <h2 className="font-bold text-blue-600 text-2xl text-center uppercase">
                    Responder solicitud de {solicitud.tipo_solicitud}
                  </h2>
                )
              }
            </div>
            <div className="bg-white shadow-xl mt-4 p-6 rounded-lg w-md max-w-2xl text-left">
              {/* Campo oculto para el correo */}
              <input type="hidden" name="correo" value={solicitud.correo || ''} />
              <input type="hidden" name="name" value="Departamento de adiestramiento y selección" />
              <div className="mt-4 text-left">
                <label htmlFor="nombre" className="font-medium text-slate-400 text-sm">Correo</label>
                <input type="text" id="nombre" className="bg-slate-200 shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe tu nombre aquí..." value={solicitud.correo || ''} disabled />
              </div>
              <div className="mt-4 text-left">
                <label htmlFor="title" className="font-medium text-slate-700 text-sm">Asunto</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={e => setAsunto(e.target.value)}
                  value={asunto !== null ? asunto : `Respuesta a la solicitud de '${solicitud.tipo_solicitud}' para ${solicitud.nombre_solicitante}`}
                  className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full"
                />

                <input
                  type="hidden"
                  id="time"
                  name="time"
                  onChange={e => setAsunto(e.target.value)}
                  value={asunto !== null ? asunto : `Respuesta a la solicitud de '${solicitud.tipo_solicitud}' para ${solicitud.nombre_solicitante}`}
                />
              </div>
              <div className="mt-4 text-left">
                <label htmlFor="respuesta" className="font-medium text-slate-700 text-sm">Tu respuesta</label>
                <textarea id="respuesta" name="message" rows="4" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full" placeholder="Escribe tu respuesta aquí..." required></textarea>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Link to="/listar-solicitudes">
                  <button className="bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-md font-bold text-slate-600 hover:text-white transition-all" disabled={sending}>
                    {
                      sending ?
                        'Espere por favor...'
                        : 'Volver'
                    }
                  </button>
                </Link>
                <button className="bg-blue-500 hover:bg-blue-700 disabled:bg-slate-600 px-4 py-2 rounded-md font-bold text-white transition-all" disabled={sending}>{sending ? 'Enviando...' : 'Enviar Respuesta'}</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-red-500">No se encontró la solicitud.</div>
        )}
      </div>
    </Layout>
  )
}
