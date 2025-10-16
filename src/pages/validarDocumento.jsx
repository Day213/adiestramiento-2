import React, { useState } from 'react'
import { QRCodeReader } from './components/QRCodeReader'
import { PDFQRValidator } from './components/PDFQRValidator'
import { Layout } from '../components/layout'




export const ValidarDocumento = () => {
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState(null)

  const handleValidar = async () => {
    if (codigo.startsWith('CERT-')) {
      setResultado('Documento válido ✅')
    } else {
      setResultado('Documento no válido ❌')
    }
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center w-full h-[60vh]">
        <h2 className="mb-6 font-bold text-blue-600 text-2xl text-center uppercase">Validar certifica</h2>
        <div className="flex flex-col items-center bg-white shadow-md p-6 border-2 border-slate-100 rounded-lg w-[40vw]">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="" className="font-bold text-gray-700 text-sm">Código del documento</label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="Ingrese el código del documento o escanee el QR"
              className="shadow px-3 py-2 border border-slate-300 rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
            />
          </div>
          <button
            onClick={handleValidar}
            className="bg-blue-500 hover:bg-blue-600 mt-4 mb-4 px-4 py-2 rounded w-full text-white uppercase transition-colors duration-200"
          >
            Validar documento
          </button>
          {resultado && (
            <div className="mt-4 font-semibold text-lg">{resultado}</div>
          )}
        </div>
      </div>
    </Layout>
  )
}
