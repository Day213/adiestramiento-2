import React, { useState, useEffect } from 'react'
import { SignJWT } from 'jose'  // Changed from 'jsonwebtoken'
import { Layout } from '../components/layout'
import { useNavigate } from 'react-router-dom'

import { InputArray } from './components/inputArray'
import { generatePDFsForParticipants } from './components/PDFGenerator'
import { generateQRCodeDataUrl } from './components/QRCodeGenerator'
import { PaticipantesSection } from './components/paticipantesSection'




export const CrearCertificado = () => {
  const navigate = useNavigate()
  const [solicitud, setSolicitud] = useState({ tipo_solicitud: 'curso/taller' })
  const [loading, setLoading] = useState(false)
  const [participantes, setParticipantes] = useState([{ name: "", cedula: "", folio: "", libro: "", reglon: "" },])

  const [formData, setFormData] = useState({
    nombre_solicitud: '',
    duracion: '',
    fecha_inicial: new Date().toISOString().split('T')[0],
    instalaciones: 'Este instituto',
    dia_emision: new Date().toISOString().split('T')[0],
    tipo_solicitud: 'curso/taller',
    contenido: [],
    participante: [],
  })

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      participante: participantes,
    }))
  }, [participantes])

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const handleDuracionChange = (value, type) => {
    // Validar que no sea negativo ni excesivamente grande
    const numValue = parseInt(value);
    if (value !== "" && (numValue < 1 || numValue > 999)) return;

    let finalType = type;
    if (numValue === 1) {
      if (type === "horas") finalType = "hora";
      if (type === "dias") finalType = "dia";
      if (type === "meses") finalType = "mes";
      if (type === "años") finalType = "año";
    }

    setFormData((prevData) => ({
      ...prevData,
      duracion: value ? `${value} ${finalType}` : "",
    }))
  }

  const handleGeneratePDFs = async () => {
    const participantesConQR = await Promise.all(formData.participante.map(async (p) => {
      const uniqueId = `CERT-${p.cedula}-${Date.now()}`
      const secret = new TextEncoder().encode(import.meta.env.VITE_CERT_SECRET || 'adiestramiento_certificados_secret')
      const token = await new SignJWT({
        id: uniqueId,
        nombre: p.name,
        nombre_curso_taller: formData.nombre_solicitud,
        cedula: p.cedula,
        duracion: formData.duracion,
        contenido: formData.contenido,
        fecha: new Date().toISOString()
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(secret)
      const qrDataUrl = await generateQRCodeDataUrl(token)
      return { ...p, qr: qrDataUrl, codigo: uniqueId, token }
    }))
    generatePDFsForParticipants({ ...formData, participante: participantesConQR })
  }

  return (
    <Layout>
      <div className=" py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 px-8 py-6 text-white">
            <h1 className="font-extrabold text-3xl tracking-tight uppercase">
              Generar Certificados
            </h1>
            <p className="mt-1 text-slate-400 text-sm">
              Complete la información para generar automáticamente los certificados para los participantes.
            </p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <form className="space-y-10" onSubmit={handleSubmit}>
                {/* Sección Información General */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                    <div className="bg-blue-600 rounded-lg w-2 h-6"></div>
                    <h2 className="font-bold text-slate-800 text-xl">Información del Evento</h2>
                  </div>

                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block mb-1.5 font-semibold text-slate-700 text-sm" htmlFor="nombre">
                        Nombre del {solicitud.tipo_solicitud}
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        placeholder="Ej: Taller de Excel Avanzado"
                        value={formData.nombre_solicitud}
                        onChange={(e) => setFormData({ ...formData, nombre_solicitud: e.target.value })}
                        className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none placeholder:text-blue-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-semibold text-slate-700 text-sm" htmlFor="duracion">
                        Duración
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="duracion"
                          type="number"
                          min="1"
                          max="999"
                          placeholder="Valor"
                          value={formData.duracion.split(' ')[0] || ''}
                          onChange={(e) => handleDuracionChange(e.target.value, formData.duracion.split(' ')[1] || 'horas')}
                          className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none placeholder:text-blue-300 font-semibold"
                        />
                        <select
                          value={formData.duracion.split(' ')[1] || 'horas'}
                          onChange={(e) => handleDuracionChange(formData.duracion.split(' ')[0] || '', e.target.value)}
                          className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all outline-none font-semibold cursor-pointer"
                        >
                          <option value="horas">Horas</option>
                          <option value="dias">Días</option>
                          <option value="meses">Meses</option>
                          <option value="años">Años</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1.5 font-semibold text-slate-700 text-sm" htmlFor="instalaciones">
                        Instalaciones
                      </label>
                      <input
                        id="instalaciones"
                        type="text"
                        placeholder="Ubicación"
                        value={formData.instalaciones}
                        onChange={(e) => setFormData({ ...formData, instalaciones: e.target.value })}
                        className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none placeholder:text-blue-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-semibold text-slate-700 text-sm" htmlFor="fecha_inicial">
                        Fecha Inicial
                      </label>
                      <input
                        id="fecha_inicial"
                        type="date"
                        value={formData.fecha_inicial}
                        onChange={(e) => setFormData({ ...formData, fecha_inicial: e.target.value })}
                        className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-semibold text-slate-700 text-sm" htmlFor="dia_emision">
                        Fecha de emisión
                      </label>
                      <input
                        id="dia_emision"
                        type="date"
                        value={formData.dia_emision}
                        onChange={(e) => setFormData({ ...formData, dia_emision: e.target.value })}
                        className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección Contenido */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                    <div className="bg-amber-500 rounded-lg w-2 h-6"></div>
                    <h2 className="font-bold text-slate-800 text-xl">Temario / Contenido</h2>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <InputArray
                      onTagsChange={(newTags) => setFormData({ ...formData, contenido: newTags })}
                      label="temas"
                      tagsDefault={formData.contenido}
                    />
                  </div>
                </div>

                {/* Sección Participantes */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                    <div className="bg-emerald-500 rounded-lg w-2 h-6"></div>
                    <h2 className="font-bold text-slate-800 text-xl">Participantes</h2>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <PaticipantesSection participantes={participantes} setParticipantes={setParticipantes} />
                  </div>
                </div>

                {/* Footer del Formulario */}
                <div className="pt-8 w-full">
                  <button
                    type="button"
                    onClick={handleGeneratePDFs}
                    className="group relative flex justify-center items-center bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl w-full font-bold text-white text-lg transition-all transform active:scale-[0.98] overflow-hidden shadow-lg shadow-blue-500/30"
                  >
                    <div className="top-0 left-0 absolute bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center gap-2">
                      Descargar Certificados en PDF
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </span>
                  </button>
                  <p className="mt-4 text-center text-slate-400 text-xs">
                    Se generará un archivo PDF individual con código QR verificado para cada participante.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
