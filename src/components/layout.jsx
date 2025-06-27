
import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useUser } from '../context/useUser'

export const Layout = ({ children }) => {
  const { user } = useUser()
  const logOut = () => {
    supabase.auth.signOut()
  }
  return (
    <div className="mx-auto container">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="font-bold text-lg uppercase">
          <img src="/logo.png" alt="Logo" className="hover:scale-110 transition-transform duration-200" width="200" />
        </Link>
        <div>
          {

            <nav id="navbar">
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
          }
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
