import React, { useState, useEffect } from 'react'
import { SignJWT } from 'jose'  // Changed from 'jsonwebtoken'
import { Layout } from '../components/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { InputArray } from './components/inputArray'
import { generatePDFsForParticipants } from './components/PDFGenerator'
import { generateQRCodeDataUrl } from './components/QRCodeGenerator'
import { PaticipantesSection } from './components/paticipantesSection'


export const CrearCertificado = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [participantes, setParticipantes] = useState([{ name: "", cedula: "", folio: "", libro: "", reglon: "" },]);

  const [formData, setFormData] = useState({
    nombre_solicitud: '',
    duracion: '',
    fecha_inicial: new Date().toISOString().split('T')[0],
    instalaciones: 'Este instituto',
    dia_emision: new Date().toISOString().split('T')[0],
    tipo_solicitud: '',
    contenido: [],
    participante: [],
  })

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      participante: participantes,
    }))
  }, [participantes])

  useEffect(() => {
    const fetchSolicitud = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) {
        setSolicitud(data)
        setFormData((prevData) => ({
          ...prevData,
          nombre_solicitud: data?.tema_solicitante || '',
          participante: data?.participantes || [], // Aseguramos que los participantes se asignen correctamente
          tipo_solicitud: data?.tipo_solicitud || '',
        }))
      } else {
        console.error('Error fetching solicitud:', error)
      }

      setLoading(false)
    }
    fetchSolicitud()

    // console.log('Solicitud:', solicitud)
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(formData)
  }

  const handleDuracionChange = (value, type) => {
    setFormData((prevData) => ({
      ...prevData,
      duracion: `${value} ${type}`,
    }))
  }

const handleGeneratePDFs = async () => {
  // Genera un código único y token JWT para cada participante
  const participantesConQR = await Promise.all(formData.participante.map(async (p) => {
    const uniqueId = `CERT-${p.cedula}-${Date.now()}`;
    
    // Generate JWT token using jose
    const secret = new TextEncoder().encode('adiestramiento_certificados_secret');
    const token = await new SignJWT({
      id: uniqueId,
      nombre: p.name,
      nombre_curso_taller: formData.nombre_solicitud,
      cedula: p.cedula,
      duracion: formData.duracion,
      fecha: new Date().toISOString()
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(secret);
    
    // Usar el token JWT como datos para el código QR
    const qrDataUrl = await generateQRCodeDataUrl(token);

    return { 
      ...p, 
      qr: qrDataUrl, 
      codigo: uniqueId,
      token
    };
  }));

  console.log('Participantes con QR y JWT:', participantesConQR);
  generatePDFsForParticipants({ ...formData, participante: participantesConQR });
};

  return (
    <Layout>
      <div className="flex justify-center items-center p-4 w-full h-[80vh]">
        <div className="shadow-xl p-4 rounded-md w-[50vw] ">
          <div className="flex justify-between items-center text-center">
            <h1 className="font-bold text-slate-600 text-xl uppercase">Generar certificados</h1>
            <button onClick={() => navigate(-1)} className="bg-slate-200 p-1 px-3 rounded-md text-slate-600 uppercase transition-colors duration-200 ">
              volver
            </button>
          </div>
          <div className="mt-4">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div>
                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="overflow-y-auto h-[60vh] pr-4">
                    <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="nombre">
                      Nombre del {solicitud.tipo_solicitud}
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_solicitud}
                      onChange={(e) => setFormData({ ...formData, nombre_solicitud: e.target.value })}
                      className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-full">
                        <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="duracion">
                          Horas
                        </label>
                        <input
                          type="number"
                          onChange={(e) => handleDuracionChange(e.target.value, formData.duracion.split(' ')[1] || 'horas')}
                          className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                        />
                      </div>
                      <div className="w-1/4">
                        <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="duracion">
                          Tiempo
                        </label>
                        <select
                          onChange={(e) => handleDuracionChange(formData.duracion.split(' ')[0] || '', e.target.value)}
                          className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                        >
                          <option value="horas">Horas</option>
                          <option value="dias">Días</option>
                          <option value="meses">Meses</option>
                          <option value="años">Años</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                      <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="fecha_inicial">
                        Fecha Inicial
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_inicial}
                        onChange={(e) => setFormData({ ...formData, fecha_inicial: e.target.value })}
                        className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="fecha_inicial">
                        Fecha de emisión
                      </label>
                      <input
                        type="date"
                        value={formData.dia_emision}
                        onChange={(e) => setFormData({ ...formData, dia_emision: e.target.value })}
                        className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="instalaciones">
                      Instalaciones
                    </label>
                    <input
                      type="text"
                      value={formData.instalaciones}
                      onChange={(e) => setFormData({ ...formData, instalaciones: e.target.value })}
                      className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="contenido">
                      Contenido
                    </label>
                    <InputArray
                      onTagsChange={(newTags) => setFormData({ ...formData, contenido: newTags })}
                      label="contenido"
                    />
                  </div>
                  <PaticipantesSection participantes={participantes} setParticipantes={setParticipantes} />
                  </div>
                  

                  <button
                    type="button"
                    onClick={handleGeneratePDFs}
                    className="bg-blue-500 hover:bg-blue-700 mt-6 px-4 py-2 rounded w-full font-bold text-white uppercase transition-colors duration-200"
                  >
                    Descargar PDFs por Participante
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
