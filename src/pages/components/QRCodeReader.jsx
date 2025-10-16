import React, { useRef } from 'react'
import jsQR from 'jsqr'

export const QRCodeReader = ({ onResult }) => {
  const fileInputRef = useRef()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function (event) {
      const img = new window.Image()
      img.src = event.target.result
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, canvas.width, canvas.height)
        if (code) {
          onResult(code.data)
        } else {
          onResult(null)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
    </div>
  )
}
