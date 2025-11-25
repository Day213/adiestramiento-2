import React, { useRef } from 'react'
import { supabase } from '../../supabase'
import { Captcha } from '../../components/Captcha'

export const CensoForm = ({ cursoTaller }) => {
  const captchaRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (captchaRef.current && !captchaRef.current.validate()) {
      return
    }
    const formData = new FormData(e.target)
    const data = {
      nombre: formData.get('nombre'),
      cedula: formData.get('cedula'),
      correo: formData.get('email'),
      telefono: formData.get('telefono'),
      curso_taller: cursoTaller.id
    }

    try {
      // Verificar si la cédula ya existe para este curso
      const { data: existingCenso, error: fetchError } = await supabase
        .from('censo')
        .select('id')
        .eq('cedula', data.cedula)
        .eq('curso_taller', data.curso_taller)

      if (fetchError) { throw fetchError }

      if (existingCenso && existingCenso.length > 0) {
        alert('No se pudo censar al participante: la cédula ya existe para este curso.')
        if (captchaRef.current) {
          captchaRef.current.resetCaptcha()
        }
        return
      }

      const { error } = await supabase.from('censo').insert([data])
      if (error) { throw error }
      alert(`Censado exitosamente para el ${cursoTaller.tipo}: ${cursoTaller.titulo} recuerde asistir el día ${cursoTaller.fecha_emision}`)
      e.target.reset()
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
      }
    } catch (error) {
      console.log(error)
    }

  }


  return (
    <div className="bg-[#f3f3f3] shadow-xl mx-auto my-12 p-6 py-12 border border-gray-300 rounded-md max-w-2xl" >
      <h2 className="mb-6 font-bold text-slate-600 text-2xl text-center uppercase">Formulario de Censo </h2>
      <form onSubmit={(e) => { onSubmit(e) }} >
        <div className="gap-4 grid grid-cols-2 mb-4">
          <div >
            <label className="block mb-2 text-gray-500 text-xs" htmlFor="nombre">Nombre Completo <span className="text-red-500">*</span></label>
            <input className="bg-white p-2 border border-gray-300 rounded w-full" type="text" id="nombre" name="nombre" required />
          </div>
          <div >
            <label className="block mb-2 text-gray-500 text-xs" htmlFor="ced">Cédula <span className="text-red-500">*</span></label>
            <input className="bg-white p-2 border border-gray-300 rounded w-full" type="number" id="ced" name="cedula" required />
          </div>
        </div >

        <div className="mb-4">
          <label className="block mb-2 text-gray-500 text-xs" htmlFor="email">Correo Electrónico <span className="text-red-500">*</span></label>
          <input className="bg-white p-2 border border-gray-300 rounded w-full" type="email" id="email" name="email" required />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-500 text-xs" htmlFor="telefono">Número de Teléfono <span className="text-red-500">*</span></label>
          <input className="bg-white p-2 border border-gray-300 rounded w-full" type="tel" id="telefono" name="telefono" required />
        </div>

        <div className="my-5">
          <Captcha ref={captchaRef} />
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 mt-6 p-2 rounded w-full font-bold text-white uppercase line-clamp-1" type="submit">Censarme para {cursoTaller.titulo}</button>
      </form >
    </div >
  )
}