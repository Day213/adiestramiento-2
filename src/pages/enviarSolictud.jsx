import React, { useState } from 'react'
import { Layout } from '../components/layout'
import { supabase } from '../supabase'

export const EnviarSolicitud = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipoSolicitud: '',
    cantidadAsistentes: '',
    nombreSolicitante: '',
    telefono: '',
    correo: '',
    fecha: '',
    tema: ''
  })
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }
  async function handleSubmit() {
    setLoading(true)
    setMensaje('')
    const newData = { ...form, telefono: parseInt(form.telefono), cantidadAsistentes: parseInt(form.cantidadAsistentes) }
    const { error } = await supabase.from('solicitudes').insert([
      {
        tipo_solicitud: newData.tipoSolicitud,
        nombre_solicitante: newData.nombreSolicitante,
        cantidad_asistente: newData.cantidadAsistentes,
        fecha_aproximada: newData.fecha,
        tema_solicitante: newData.tema,
        telefono: newData.telefono,
        correo: newData.correo,
      }
    ])
    if (error) {
      setMensaje('Error al enviar la solicitud. Intenta nuevamente.')
      console.error(error)
    } else {
      setMensaje('¡Solicitud enviada correctamente!')
      setForm({
        tipoSolicitud: '',
        cantidadAsistentes: '',
        nombreSolicitante: '',
        telefono: '',
        correo: '',
        fecha: '',
        tema: ''
      })
    }
    setLoading(false)
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-6 h-[85vh]">
        <h2 className="font-bold text-blue-700 text-2xl text-center uppercase">Gestion de solicitud</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <div className="bg-white shadow-xl p-6 border border-slate-200 rounded-lg w-full max-w-md">
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 mt-6 w-1/2">
                <label htmlFor="tipoSolicitud" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Tipo de solicitud</label>
                <select id="tipoSolicitud" className="p-2 border border-gray-300 rounded w-full" value={form.tipoSolicitud} onChange={handleChange} required>
                  <option value="" disabled>Opciones</option>
                  <option value="taller">taller</option>
                  <option value="curso">curso</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 mt-6 w-1/2">
                <label htmlFor="cantidadAsistentes" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Cantidad de asistentes</label>
                <input id="cantidadAsistentes" type="number" className="p-2 border border-gray-300 rounded w-full" value={form.cantidadAsistentes} onChange={handleChange} required min="1" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <label htmlFor="nombreSolicitante" className="-mb-2 font-bold text-slate-500 text-xs uppercase">¿Quien lo solicita? <small>(Nombre completo)</small></label>
              <input id="nombreSolicitante" className="p-2 border border-gray-300 rounded w-full" value={form.nombreSolicitante} onChange={handleChange} required />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 mt-4">
                <label htmlFor="telefono" className="-mb-2 font-bold text-slate-500 text-xs uppercase">teléfono</label>
                <input id="telefono" className="p-2 border border-gray-300 rounded w-full" value={form.telefono} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <label htmlFor="correo" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Correo</label>
                <input id="correo" type="email" className="p-2 border border-gray-300 rounded w-full" value={form.correo} onChange={handleChange} required />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <label htmlFor="fecha" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Fecha aproximada</label>
              <input id="fecha" type="date" className="p-2 border border-gray-300 rounded w-full" value={form.fecha} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <label htmlFor="tema" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Tema</label>
              <input id="tema" className="p-2 border border-gray-300 rounded w-full" value={form.tema} onChange={handleChange} required />
            </div>
            <div className="flex gap-6 mt-4">
              <button type="submit" className="bg-blue-600 py-3 rounded-md w-full font-bold text-white text-sm uppercase" disabled={loading}>{loading ? 'Enviando...' : 'Enviar solicitud'}</button>
            </div>
            {mensaje && <div className="mt-4 font-bold text-green-600 text-center">{mensaje}</div>}
          </div>
        </form>
      </div>
    </Layout>
  )
}
