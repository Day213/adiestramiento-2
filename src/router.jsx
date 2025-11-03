
import { Routes, Route, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Login } from "./pages/login"
import { Pagina404 } from "./pages/pagina404"
import { EnviarSolicitud } from "./pages/enviarSolictud"
import { ListarSolicitud } from "./pages/listarSolicitud"
import { ResponderSolicitud } from "./pages/responderSolicitud"
import { supabase } from './supabase'
import NetlifyEmailForm from "./pages/NetlifyEmailForm"
import { CrearCertificado } from "./pages/crearCertificado"
import { ValidarDocumento } from "./pages/validarDocumento"
import { CursoTallerPage } from "./pages/cursoTallerPage"
import { ListarCursosyTallers } from "./pages/listarCursosyTallers"
import { EditarCursoyTaller } from "./pages/editarCursoyTaller"
import { CursoTallersinglePage } from "./pages/cursoTallersinglePage"

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
      <Route path="/solicitudes" element={
        <PublicRoute>
          <EnviarSolicitud />
        </PublicRoute>
      } />

      <Route path="/" element={
        <PublicRoute>
          <ListarCursosyTallers />
        </PublicRoute>
      } />
      <Route path="/curso-taller/:id" element={
        <PublicRoute>
          <CursoTallersinglePage />
        </PublicRoute>
      } />
      {/* Ruta pública para validar documentos */}
      <Route path="/validar-documento" element={<ValidarDocumento />} />
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

      <Route path="/nuevo-curso-taller" element={
        <ProtectedRoute>
          <CursoTallerPage />
        </ProtectedRoute>
      } />

      <Route path="/editar-curso-taller/:id" element={
        <ProtectedRoute>
          <EditarCursoyTaller />
        </ProtectedRoute>
      } />

      <Route path="/crear-certificado/:id" element={
        <ProtectedRoute>
          <CrearCertificado />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

