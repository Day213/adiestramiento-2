import React, { useState } from 'react'
import { Layout } from '../components/layout'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit() {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      setError('El usuario o constraseña no son correctos')
    } else {
      navigate('/listar-solicitudes')
    }
    setLoading(false)
  }
  // const token = JSON.parse(localStorage.getItem('sb-rokbtsjbkbckzpcwiemi-auth-token'))
  return (
    <Layout>
      <div className="flex justify-center items-center h-[85vh]">
        <div className="bg-white shadow-md p-8 rounded w-96">
          <h2 className="mb-6 font-bold text-blue-600 text-2xl text-center uppercase">Iniciar Sesión</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <div className="mb-4">
              <label
                className="block mb-2 font-medium text-slate-700 text-sm"
                htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 font-medium text-slate-700 text-sm"
                htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded w-full text-white uppercase"
              disabled={loading}
            >{loading ? 'Cargando...' : 'Login'}</button>
          </form>
        </div>
      </div >
    </Layout>
  )
}
