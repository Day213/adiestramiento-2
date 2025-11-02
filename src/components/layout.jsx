
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'
import { useUser } from '../context/useUser'

export const Layout = ({ children }) => {
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
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
                  <Link to="/" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Cursos disponibles
                  </Link>
                </li>
                <li>
                  <Link to="/solicitudes" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/solicitudes' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Crear solicitud
                  </Link>
                </li>
                <li>
                  <Link to="/validar-documento" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/validar-documento' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Validar documento
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/login' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link to="/nuevo-curso-taller" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/nuevo-curso-taller' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Nuevo curso o taller
                  </Link>
                </li>
                <li>
                  <Link to="/listar-solicitudes" className={`font-bold text-sm uppercase transition-all ${location.pathname === '/listar-solicitudes' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`}>
                    Lista de cursos y talleres
                  </Link>
                </li>
                <li>
                  <button className="bg-slate-400 p-2 rounded-md font-bold text-white text-sm uppercase" onClick={logOut}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
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
                    <Link to="/" className={`font-bold transition-all ${location.pathname === '/' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`} onClick={() => setMenuOpen(false)}>
                      Crear solicitud
                    </Link>
                  </li>
                  <li>
                    <Link to="/validar-documento" className={`font-bold transition-all ${location.pathname === '/validar-documento' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`} onClick={() => setMenuOpen(false)}>
                      Validar documento
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className={`font-bold transition-all ${location.pathname === '/login' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`} onClick={() => setMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <Link to="/nuevo-curso-taller" className={`font-bold transition-all ${location.pathname === '/nuevo-curso-taller' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`} onClick={() => setMenuOpen(false)}>
                      Nuevo curso o taller
                    </Link>
                  </li>
                  <li>
                    <Link to="/listar-solicitudes" className={`font-bold transition-all ${location.pathname === '/listar-solicitudes' ? 'text-blue-400' : 'text-slate-400 hover:text-blue-700'}`} onClick={() => setMenuOpen(false)}>
                      Lista de cursos y talleres
                    </Link>
                  </li>
                  <li>
                    <button className="bg-slate-400 p-2 rounded-md w-full font-bold text-white" onClick={logOut}>
                      Cerrar Sesión
                    </button>
                  </li>
                </>
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
