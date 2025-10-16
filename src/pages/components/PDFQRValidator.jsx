import React, { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import jsQR from 'jsqr'

// Usar el worker local de pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js'

export const PDFQRValidator = ({ onResult }) => {
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e) => {
    setLoading(true)
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async function (event) {
      const typedarray = new Uint8Array(event.target.result)
      const pdf = await pdfjsLib.getDocument(typedarray).promise
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      await page.render({ canvasContext: context, viewport }).promise
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      if (code) {
        onResult(code.data)
      } else {
        onResult(null)
      }
      setLoading(false)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>Procesando PDF...</p>}
    </div>
  )
}
