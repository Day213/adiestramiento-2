import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'

const generarCaptcha = () => ({
  num1: Math.floor(Math.random() * 10),
  num2: Math.floor(Math.random() * 10),
  respuesta: ''
})

export const Captcha = forwardRef(({ onValidate }, ref) => {
  const [captcha, setCaptcha] = useState(generarCaptcha())
  const [captchaError, setCaptchaError] = useState('')
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    resetCaptcha: () => {
      setCaptcha(generarCaptcha())
      setCaptchaError('')
      if (inputRef.current) inputRef.current.value = ''
    },
    focusInput: () => {
      if (inputRef.current) inputRef.current.focus()
    }
  }))

  const handleChange = (e) => {
    setCaptcha(prev => ({ ...prev, respuesta: e.target.value }))
  }

  const validate = () => {
    if (parseInt(captcha.respuesta) !== captcha.num1 + captcha.num2) {
      setCaptchaError('Respuesta incorrecta, intenta de nuevo.')
      setCaptcha(prev => ({ ...prev, respuesta: '' }))
      if (inputRef.current) inputRef.current.focus()
      return false
    }
    setCaptchaError('')
    return true
  }

  // Permite al padre validar el captcha
  React.useEffect(() => {
    if (onValidate) onValidate(validate)
    // eslint-disable-next-line
  }, [captcha])

  return (
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-bold text-slate-500 text-xs uppercase">
        Captcha: ¿Cuánto es {captcha.num1} + {captcha.num2}?
      </label>
      <input
        type="number"
        className="p-2 border border-gray-300 rounded w-full"
        value={captcha.respuesta}
        onChange={handleChange}
        ref={inputRef}
        required
        min="0"
        placeholder="Respuesta"
      />
      {captchaError && <span className="font-bold text-red-600 text-xs">{captchaError}</span>}
    </div>
  )
})
