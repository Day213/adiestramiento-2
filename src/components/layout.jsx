
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export const Layout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("admin_session_token") !== null)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("admin_session_token")
    setIsAuthenticated(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky py-2 top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group transition-all">
                <div className="p-1.5 group-hover:scale-110 transition-transform">
                  <img src="./logo.webp" alt="logo" className="w-auto h-14" />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/validar"
                className={`text-sm font-semibold transition-colors ${location.pathname === '/validar' ? 'text-blue-600 bg-blue-50 px-3 py-2 rounded-xl' : 'text-slate-500 hover:text-slate-800 px-3 py-2'}`}
              >
                VALIDAR CERTIFICADO
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`text-sm font-semibold transition-colors ${location.pathname === '/admin' ? ' px-3 py-2 rounded-xl' : 'text-slate-500 hover:text-slate-800 px-3 py-2'}`}
                  >
                    GENERAR CERTIFICADOS
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`text-xs font-bold text-slate-300 hover:text-slate-500 transition-colors ${location.pathname === '/login' ? 'hidden' : ''}`}
                  title="Acceso Privado"
                >
                  INICIAR SESIÓN
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="py-8 bg-white border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
          {new Date().getFullYear()} CERTIFICADOS UNEFM
        </p>
      </footer>
    </div>
  )
}
