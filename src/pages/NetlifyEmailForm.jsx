import React, { useState } from 'react'

export default function NetlifyEmailForm() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        name="contacto-netlify"
        method="POST"
        data-netlify="true"
        className="bg-white shadow-xl p-6 border border-slate-200 rounded-lg w-full max-w-md"
        onSubmit={() => setEnviado(true)}
      >
        <input type="hidden" name="form-name" value="contacto-netlify" />
        <h2 className="mb-4 font-bold text-blue-700 text-2xl text-center uppercase">Formulario de Prueba Netlify</h2>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-slate-500 text-xs" htmlFor="nombre">Nombre</label>
          <input className="p-2 border border-gray-300 rounded w-full" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-slate-500 text-xs" htmlFor="email">Email</label>
          <input className="p-2 border border-gray-300 rounded w-full" id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-slate-500 text-xs" htmlFor="mensaje">Mensaje</label>
          <textarea className="p-2 border border-gray-300 rounded w-full" id="mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} required />
        </div>
        <button type="submit" className="bg-blue-600 py-3 rounded-md w-full font-bold text-white text-sm uppercase">Enviar</button>
        {enviado && <div className="mt-4 font-bold text-green-600 text-center">¡Formulario enviado! Revisa tu correo de Netlify.</div>}
      </form>
    </div>
  )
}
