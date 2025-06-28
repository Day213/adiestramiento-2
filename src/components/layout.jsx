
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useUser } from '../context/useUser'

export const Layout = ({ children }) => {
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const logOut = () => {
    supabase.auth.signOut()
    setMenuOpen(false)
  }
  return (
    <div className="mx-auto container">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="font-bold text-lg uppercase">
          <img src="/logo.png" alt="Logo" className="hover:scale-110 transition-transform duration-200" width="200" />
        </Link>
        {/* Botón hamburguesa para móvil */}
        <button
          className="md:hidden flex flex-col justify-center items-center focus:outline-none w-10 h-10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-7 h-1 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-1 bg-gray-700 rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Menú de navegación */}
        <nav id="navbar" className="hidden md:block">
          <ul className="flex items-center gap-4">
            {!user && (
              <>
                <li>
                  <Link to="/" className="font-bold text-slate-400 hover:text-blue-600 transition-all">
                    Crear solicitud
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="font-bold text-slate-400 hover:text-blue-600 transition-all">
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <button className="bg-red-400 p-2 rounded-md font-bold text-white" onClick={logOut}>
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
        {/* Menú móvil */}
        {menuOpen && (
          <nav className="md:hidden top-20 right-4 z-50 absolute bg-white shadow-lg p-6 rounded-lg animate-fade-in">
            <ul className="flex flex-col gap-4">
              {!user && (
                <>
                  <li>
                    <Link to="/" className="font-bold text-slate-400 hover:text-blue-600 transition-all" onClick={() => setMenuOpen(false)}>
                      Crear solicitud
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="font-bold text-slate-400 hover:text-blue-600 transition-all" onClick={() => setMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li>
                  <button className="bg-red-400 p-2 rounded-md w-full font-bold text-white" onClick={logOut}>
                    Cerrar Sesión
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
