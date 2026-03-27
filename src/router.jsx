

import { Routes, Route } from "react-router"
import { CrearCertificado } from "./pages/crearCertificado"
import { Pagina404 } from "./pages/pagina404"

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CrearCertificado />} />
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  )
}

