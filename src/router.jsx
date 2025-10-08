
import { Routes, Route, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Login } from "./pages/login"
import { Pagina404 } from "./pages/pagina404"
import { EnviarSolicitud } from "./pages/enviarSolictud"
import { ListarSolicitud } from "./pages/listarSolicitud"
import { ResponderSolicitud } from "./pages/responderSolicitud"
import { supabase } from './supabase'
import NetlifyEmailForm from "./pages/NetlifyEmailForm"

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session) navigate('/login')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) navigate('/login')
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [navigate])
  if (!session) return null
  return children
}

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) navigate('/listar-solicitudes')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) navigate('/listar-solicitudes')
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [navigate])
  if (session) return null
  return children
}

export const Router = () => {
  return (
    <Routes>
      <Route path="*" element={<Pagina404 />} />
      
      {/* Rutas públicas solo para no autenticados */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/enviar-solicitud" element={
        <PublicRoute>
          <EnviarSolicitud />
        </PublicRoute>
      } />
      <Route path="/" element={
        <PublicRoute>
          <EnviarSolicitud />
        </PublicRoute>
      } />
      {/* Rutas protegidas solo para autenticados */}
      <Route path="/listar-solicitudes" element={
        <ProtectedRoute>
          <ListarSolicitud />
        </ProtectedRoute>
      } />
      <Route path="/responder-solicitudes/:id" element={
        <ProtectedRoute>
          <ResponderSolicitud />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

