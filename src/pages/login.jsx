
import React, { useState } from 'react'
import { Layout } from '../components/layout'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        // Opción 1: Generar un token dinámico basado en la clave (más seguro que 'true')
        const sessionToken = btoa(password + "_ADIESTRAMIENTO_2024");
        localStorage.setItem("admin_session_token", sessionToken);
        navigate('/admin')
      } else {
        setError('Clave de acceso incorrecta')
      }
    } catch (err) {
      setError('Error en el sistema de seguridad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-[85vh] bg-gray-50/50">
        <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl border border-slate-100 transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Área Restringida</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">Ingrese la clave de seguridad para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider" 
                htmlFor="password"
              >
                Clave de Acceso
              </label>
              <div className="relative group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-center text-xl tracking-[0.5em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 group overflow-hidden"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verificar Acceso
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              SISTEMA DE SEGURIDAD PROTEGIDO - ACCESO RESTRINGIDO
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
