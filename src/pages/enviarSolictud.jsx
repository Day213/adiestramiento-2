import React, { useState, useRef } from 'react'
import { Layout } from '../components/layout'
import { supabase } from '../supabase'
import { sendEmailSolicitud } from '../sendEmail'

export const EnviarSolicitud = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipoSolicitud: 'taller',
    cantidadAsistentes: '1',
    nombreSolicitante: 'Freddy',
    telefono: '0424242424',
    correo: 'freddyskull11@gmail.com',
    fecha: '2025-10-08',
    tema: 'Taller'
  })
  const [mensaje, setMensaje] = useState('')
  const [captcha, setCaptcha] = useState({
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10),
    respuesta: ''
  })
  const [captchaError, setCaptchaError] = useState('')
  const captchaInputRef = useRef(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }

  const handleCaptchaChange = (e) => {
    setCaptcha(prev => ({ ...prev, respuesta: e.target.value }))
  }

  const handleSubmit = async () => {
    setCaptchaError('')
    // Validar captcha
    if (parseInt(captcha.respuesta) !== captcha.num1 + captcha.num2) {
      setCaptchaError('Respuesta incorrecta, intenta de nuevo.')
      setCaptcha(prev => ({ ...prev, respuesta: '' }))
      if (captchaInputRef.current) captchaInputRef.current.focus()
      return false
    }

    setLoading(true)
    setMensaje('')
    const newData = { 
      ...form, 
      telefono: parseInt(form.telefono), 
      cantidadAsistentes: parseInt(form.cantidadAsistentes) 
    }

    try {
      // Enviar correo
      await sendEmailSolicitud({

        subject: `Nueva solicitud de ${newData.nombreSolicitante}`,
        message: `Nueva solicitud recibida:\n\n` +
          `Tipo de solicitud: ${newData.tipoSolicitud}\n` +
          `Cantidad de asistentes: ${newData.cantidadAsistentes}\n` +
          `Nombre del solicitante: ${newData.nombreSolicitante}\n` +
          `Teléfono: ${newData.telefono}\n` +
          `Correo: ${newData.correo}\n` +
          `Fecha aproximada: ${newData.fecha}\n` +
          `Tema: ${newData.tema}`
      })

      // Guardar en Supabase
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

      if (error) throw error

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

      // Nuevo captcha tras envío exitoso
      setCaptcha({
        num1: Math.floor(Math.random() * 10),
        num2: Math.floor(Math.random() * 10),
        respuesta: ''
      })

      return true
    } catch (error) {
      console.error('Error:', error)
      setMensaje('Error al procesar la solicitud. Intenta nuevamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const success = await handleSubmit()
    
    if (success) {
      try {
        const response = await fetch('https://formsubmit.co/7147947b08bd30163748271b42e3ba0a', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'Tipo de solicitud': form.tipoSolicitud,
            'Cantidad de asistentes': form.cantidadAsistentes,
            'Nombre del solicitante': form.nombreSolicitante,
            'Teléfono': form.telefono,
            'Correo electrónico': form.correo,
            'Fecha': form.fecha,
            'Tema': form.tema,
            '_subject': `Departamento de Adiestramiento - Nueva solicitud de ${form.nombreSolicitante}`,
            '_captcha': 'false', // Deshabilitar captcha de FormSubmit ya que ya tenemos el nuestro
            '_template': 'table', // Formato de tabla para mejor legibilidad
            '_from': 'Departamento de Adiestramiento <tucorreo@formsubmit.com>' // Personalizar remitente
          })
        });
        
        if (!response.ok) {
          throw new Error('Error al enviar el formulario');
        }
        
        // Opcional: Redirigir a una página de éxito si es necesario
        // window.location.href = 'https://tudominio.com/gracias';
        
      } catch (error) {
        console.error('Error al enviar a FormSubmit:', error);
        // Aquí podrías mostrar un mensaje al usuario si lo deseas
        // setMensaje('Error al enviar el formulario. Por favor intente de nuevo.');
      }
    }
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-6 h-[85vh]">
        <h2 className="font-bold text-blue-700 text-2xl text-center uppercase">Gestión de solicitud</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="bg-white shadow-xl p-6 border border-slate-200 rounded-lg w-full max-w-md">
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 mt-6 w-1/2">
                <label htmlFor="tipoSolicitud" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Tipo de solicitud</label>
                <select 
                  id="tipoSolicitud" 
                  name="tipoSolicitud" 
                  className="p-2 border border-gray-300 rounded w-full" 
                  value={form.tipoSolicitud} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>Opciones</option>
                  <option value="taller">Taller</option>
                  <option value="curso">Curso</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 mt-6 w-1/2">
                <label htmlFor="cantidadAsistentes" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Cantidad de asistentes</label>
                <input 
                  id="cantidadAsistentes" 
                  name="cantidadAsistentes" 
                  type="number" 
                  className="p-2 border border-gray-300 rounded w-full" 
                  value={form.cantidadAsistentes} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <label htmlFor="nombreSolicitante" className="-mb-2 font-bold text-slate-500 text-xs uppercase">¿Quién lo solicita? <small>(Nombre completo)</small></label>
              <input 
                id="nombreSolicitante" 
                name="nombreSolicitante" 
                className="p-2 border border-gray-300 rounded w-full" 
                value={form.nombreSolicitante} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 mt-4 w-1/2">
                <label htmlFor="telefono" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Teléfono</label>
                <input 
                  id="telefono" 
                  name="telefono" 
                  type="tel" 
                  className="p-2 border border-gray-300 rounded w-full" 
                  value={form.telefono} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-4 mt-4 w-1/2">
                <label htmlFor="correo" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Correo</label>
                <input 
                  id="correo" 
                  name="correo" 
                  type="email" 
                  className="p-2 border border-gray-300 rounded w-full" 
                  value={form.correo} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <label htmlFor="fecha" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Fecha aproximada</label>
              <input 
                id="fecha" 
                name="fecha" 
                type="date" 
                className="p-2 border border-gray-300 rounded w-full" 
                value={form.fecha} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <label htmlFor="tema" className="-mb-2 font-bold text-slate-500 text-xs uppercase">Tema</label>
              <input 
                id="tema" 
                name="tema" 
                className="p-2 border border-gray-300 rounded w-full" 
                value={form.tema} 
                onChange={handleChange} 
                required 
              />
            </div>
            {/* Captcha simple */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-bold text-slate-500 text-xs uppercase">
                Captcha: ¿Cuánto es {captcha.num1} + {captcha.num2}?
              </label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded w-full"
                value={captcha.respuesta}
                onChange={handleCaptchaChange}
                ref={captchaInputRef}
                required
                min="0"
                placeholder="Respuesta"
              />
              {captchaError && <span className="text-red-500 text-sm">{captchaError}</span>}
            </div>
            <div className="mt-6">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
            {mensaje && (
              <div className={`mt-4 p-3 rounded-md ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {mensaje}
              </div>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )
}