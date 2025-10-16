import React, { useState } from 'react'
import { jwtVerify } from 'jose'
import { QRCodeReader } from './components/QRCodeReader'
import { Layout } from '../components/layout'

export const ValidarDocumento = () => {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)
  const [certificadoInfo, setCertificadoInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const validarToken = async (token) => {
    try {
      const secret = new TextEncoder().encode('adiestramiento_certificados_secret')
      const { payload } = await jwtVerify(token, secret)
      return payload
    } catch (error) {
      console.error('Error al validar el token:', error)
      return null
    }
  }

  const handleValidar = async () => {
    if (!codigo) {
      setResultado('Por favor ingrese un código para validar')
      return
    }

    setIsLoading(true)
    try {
      // Si el código es un JWT (comienza con 'ey' y tiene puntos)
      if (codigo.startsWith('ey') && codigo.split('.').length === 3) {
        const payload = await validarToken(codigo)
        
        if (payload) {
          setCertificadoInfo({
            nombre: payload.nombre,
            cedula: payload.cedula,
            fecha: new Date(payload.iat * 1000).toLocaleDateString(),
            duracion: payload.duracion,
            nombre_curso_taller: payload.nombre_curso_taller,
            id: payload.id
          })
          setResultado('✅ Certificado válido')
        } else {
          setResultado('❌ Código de certificado inválido')
          setCertificadoInfo(null)
        }
      } else if (codigo.startsWith('CERT-')) {
        // Para compatibilidad con códigos antiguos
        setResultado('⚠️ Código de formato antiguo detectado')
        setCertificadoInfo({
          id: codigo,
          mensaje: 'Este certificado fue generado con una versión anterior del sistema.'
        })
      } else {
        setResultado('❌ Formato de código no reconocido')
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

  const handleScan = (data) => {
    if (data) {
      setCodigo(data)
      // Opcional: validar automáticamente al escanear
      // handleValidar()
    }
  }

  const handleError = (err) => {
    console.error('Error al escanear el código QR:', err)
    setResultado('❌ Error al escanear el código QR')
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-full min-h-[80vh] py-8">
        <h2 className="mb-6 font-bold text-blue-600 text-2xl text-center uppercase">Validar Certificado</h2>
        
        <div className="flex flex-col items-center bg-white shadow-md p-6 border-2 border-slate-100 rounded-lg w-full max-w-2xl">
          <div className="w-full mb-6">
            <div className="flex flex-col gap-2 w-full mb-4">
              <label htmlFor="codigo" className="font-bold text-gray-700 text-sm">Código del documento</label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ingrese el código JWT del certificado o escanee el QR"
                className="shadow px-3 py-2 border border-slate-300 rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">O escanee el código QR:</p>
              <div className="border-2 border-dashed border-gray-300 rounded p-2">
                <QRCodeReader onScan={handleScan} onError={handleError} />
              </div>
            </div>

            <button
              onClick={handleValidar}
              disabled={isLoading || !codigo}
              className={`mt-2 mb-4 px-4 py-2 rounded w-full text-white uppercase transition-colors duration-200 ${
                isLoading || !codigo ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Validando...' : 'Validar documento'}
            </button>
          </div>

          {resultado && (
            <div className="w-full">
              <div className={`p-4 rounded-md mb-4 ${
                resultado.includes('✅') ? 'bg-green-100 text-green-800' : 
                resultado.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <p className="font-semibold text-lg">{resultado}</p>
              </div>

              {certificadoInfo && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-bold text-gray-800 text-lg mb-3">Información del Certificado</h3>
                  <div className="space-y-2">
                    {certificadoInfo.nombre_curso_taller && (
                      <p><span className="font-semibold">Titulo:</span> {certificadoInfo.nombre_curso_taller}</p>
                    )}
                    {certificadoInfo.nombre && (
                      <p><span className="font-semibold">Otorgado a:</span> {certificadoInfo.nombre}</p>
                    )}
                    {certificadoInfo.cedula && (
                      <p><span className="font-semibold">Cédula:</span> {certificadoInfo.cedula}</p>
                    )}
                    {certificadoInfo.duracion && (
                      <p><span className="font-semibold">Duración:</span> {certificadoInfo.duracion}</p>
                    )}
                    {certificadoInfo.fecha && (
                      <p><span className="font-semibold">Fecha de emisión:</span> {certificadoInfo.fecha}</p>
                    )}
                    
                    {/* {certificadoInfo.id && (
                      <p className="text-sm text-gray-600 break-all"><span className="font-semibold">ID:</span> {certificadoInfo.id}</p>
                    )} */}
                    {certificadoInfo.mensaje && (
                      <p className="text-yellow-700">{certificadoInfo.mensaje}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}