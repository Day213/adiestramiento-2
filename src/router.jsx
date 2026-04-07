

import { Routes, Route, Navigate } from "react-router"
import { CrearCertificado } from "./pages/crearCertificado"
import { ValidarDocumento } from "./pages/validarDocumento"
import { Login } from "./pages/login"
import { Pagina404 } from "./pages/pagina404"

const isAuthenticated = () => {
  const token = localStorage.getItem("admin_session_token");
  const expectedToken = btoa(import.meta.env.VITE_ADMIN_PASSWORD + "_ADIESTRAMIENTO_2024");
  return token === expectedToken;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return children
}

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated() ? <Navigate to="/admin" replace /> : <ValidarDocumento />
      } />
      <Route path="/validar" element={<ValidarDocumento />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <CrearCertificado />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Pagina404 />} />
    </Routes>
  )
}

