import React from 'react'
import { Link } from 'react-router-dom'

export const Layout = ({ children }) => {
  const getLinkClass = ({ isActive }) =>
    isActive
      ? "text-slate-500 underline"
      : "text-blue-500 hover:underline"

  return (
    <div className="mx-auto container">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="font-bold text-lg uppercase">
          <img src="/logo.png" alt="Logo" className="hover:scale-110 transition-transform duration-200" width="200" />
        </Link>
        <div>
          <div>
            <ul className="flex gap-4">
              <li>
                <Link
                  to="/"
                >
                  Crear solicitud
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                >
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>
          {/* <button className="bg-blue-500 hover:bg-blue-700 p-2 px-4 rounded-md text-white">
            Cerrar Sesión
          </button> */}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
