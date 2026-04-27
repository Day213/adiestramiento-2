import React, { useState, useEffect, Fragment } from 'react'
import { jwtVerify } from 'jose'
import { useSearchParams } from 'react-router-dom'
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react'
import { Layout } from '../components/layout'

export const ValidarDocumento = () => {
  const [searchParams] = useSearchParams()
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [certificadoInfo, setCertificadoInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const validarToken = async (token) => {
    try {
      const secretKey = 'adiestramiento_certificados_secret'
      const secret = new TextEncoder().encode(secretKey)
      const { payload } = await jwtVerify(token, secret)
      return payload
    } catch (error) {
      console.error('Error al validar el token:', error)
      return null
    }
  }

  const ejecutarValidacion = async (codigoLimpio) => {
    setIsLoading(true)
    try {
      const partes = codigoLimpio.split('.')
      if (!codigoLimpio.startsWith('ey') || partes.length < 3) {
        setResultado('Token inválido o incompleto')
        setCertificadoInfo(null)
        setIsLoading(false)
        return
      }
      
      const payload = await validarToken(codigoLimpio)
        
      if (payload) {
        setCertificadoInfo({
          nombre: payload.nombre,
          cedula: payload.cedula,
          fecha: new Date(payload.iat * 1000).toLocaleDateString(),
          duracion: payload.duracion,
          nombre_curso_taller: payload.nombre_curso_taller,
          contenido: payload.contenido,
          id: payload.id
        })
        setResultado('✅ Certificado válido')
        setIsModalOpen(true)
      } else {
        setResultado('❌ Código de certificado inválido')
        setCertificadoInfo(null)
      }
    } catch (error) {
      console.error('Error al validar el certificado:', error)
      setResultado('❌ Error al validar el certificado')
      setCertificadoInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      console.log('Token recibido:', token)
      setCodigo(token)
      ejecutarValidacion(token)
    }
  }, [searchParams])

  const handleValidar = async () => {
    const codigoLimpio = codigo.replace(/\s/g, '')
    
    if (!codigoLimpio) {
      setResultado('Por favor ingrese un código para validar')
      return
    }

    await ejecutarValidacion(codigoLimpio)
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-full min-h-[80vh] py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.016 11.955 11.955 0 01-1.532 11.048C4.582 18.29 7.73 20.211 11.137 21a11.955 11.955 0 002.726 0c3.407-.789 6.555-2.71 8.287-3.992a11.955 11.955 0 00-1.532-11.048z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Validar Certificado</h1>
          <p className="text-slate-500 mt-2 text-lg">Confirme la autenticidad de sus documentos digitales</p>
        </div>
        
        <div className="flex flex-col items-center bg-white shadow-2xl p-8 border border-slate-100 rounded-[2.5rem] w-full max-w-2xl transform transition-all hover:shadow-blue-900/5">
          <div className="w-full">
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label htmlFor="codigo" className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Código del documento
                </label>
                <div className="relative">
                  <input
                    id="codigo"
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingrese el código JWT del certificado..."
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={handleValidar}
                disabled={isLoading || !codigo}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                  isLoading || !codigo 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Validar documento
                  </>
                )}
              </button>
            </div>
          </div>

          {resultado && !resultado.includes('✅') && (
            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-5 rounded-2xl mb-6 border bg-red-50 border-red-100 text-red-800 flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <p className="font-bold text-lg">{resultado.split(' ').slice(1).join(' ')}</p>
              </div>
            </div>
          )}

          {/* Modal de Validación Exitosa */}
          <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
              </TransitionChild>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95 translate-y-4"
                    enterTo="opacity-100 scale-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-0"
                    leaveTo="opacity-0 scale-95 translate-y-4"
                  >
                    <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">Documento Verificado</h3>
                        <p className="text-slate-500 font-medium">La firma digital es auténtica y válida</p>
                      </div>

                      {certificadoInfo && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 gap-y-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título del curso</p>
                              <p className="text-slate-800 font-bold leading-tight text-lg">{certificadoInfo.nombre_curso_taller}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participante</p>
                                <p className="text-slate-800 font-bold leading-none">{certificadoInfo.nombre}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cédula</p>
                                <p className="text-slate-800 font-bold leading-none">{certificadoInfo.cedula}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 mt-1">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duración</p>
                                <p className="text-slate-800 font-bold leading-none">{certificadoInfo.duracion}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha Emisión</p>
                                <p className="text-slate-800 font-bold leading-none">{certificadoInfo.fecha}</p>
                              </div>
                            </div>
                          </div>

                          {certificadoInfo.contenido && certificadoInfo.contenido.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenido Programático</p>
                              <div className="flex flex-wrap gap-2">
                                {certificadoInfo.contenido.map((tema, i) => (
                                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100 uppercase">
                                    {tema}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2">
                             <button 
                               onClick={() => setIsModalOpen(false)}
                               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
                             >
                               Entendido
                             </button>
                          </div>
                        </div>
                      )}
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
        
        <div className="mt-12 text-slate-400 text-sm font-medium text-center">
          Sistema Verificado • Cifrado de 256 bits
        </div>
      </div>
    </Layout>
  )
}