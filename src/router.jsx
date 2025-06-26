import { Routes, Route } from "react-router"
import { Login } from "./pages/login"
import { Pagina404 } from "./pages/pagina404"
import { EnviarSolicitud } from "./pages/enviarSolictud"
import { ListarSolicitud } from "./pages/listarSolicitud"
import { ResponderSolicitud } from "./pages/responderSolicitud"

export const Router = () => {
  return (
    <Routes>
      <Route path="*" element={<Pagina404 />} />
      <Route path="/" element={<EnviarSolicitud />} />
      <Route path="/login" element={<Login />} />
      <Route path="/listar-solicitudes" element={<ListarSolicitud />} />
      <Route path="/responder-solicitudes" element={<ResponderSolicitud />} />
      <Route path="/enviar-solicitud" element={<EnviarSolicitud />} />
    </Routes>
  )
}

