
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export const Layout = ({ children, fullWidth = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("admin_session_token") !== null)
  }, [location])

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("admin_session_token")
    setIsAuthenticated(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group transition-all shrink-0">
              <div className="p-1.5 group-hover:scale-110 transition-transform">
                <img src="./logo.webp" alt="logo" className="w-auto h-14" />
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/validar"
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${location.pathname === '/validar' ? 'text-blue-600 bg-blue-50 px-3 py-2 rounded-xl' : 'text-slate-500 hover:text-slate-800 px-3 py-2'}`}
              >
                VALIDAR CERTIFICADO
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`text-sm font-semibold transition-colors whitespace-nowrap ${location.pathname === '/admin' ? 'text-blue-600 bg-blue-50 px-3 py-2 rounded-xl' : 'text-slate-500 hover:text-slate-800 px-3 py-2'}`}
                  >
                    GENERAR CERTIFICADOS
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`text-xs font-bold text-slate-300 hover:text-slate-500 transition-colors whitespace-nowrap ${location.pathname === '/login' ? 'hidden' : ''}`}
                  title="Acceso Privado"
                >
                  INICIAR SESIÓN
                </Link>
              )}
            </div>

            {/* Hamburger Button (mobile only) */}
            <button
              className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Abrir menú"
            >
              <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-600 my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-slate-100 px-4 py-2 flex flex-col gap-1">
            <Link
              to="/validar"
              className={`text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors ${location.pathname === '/validar' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              VALIDAR CERTIFICADO
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={`text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors ${location.pathname === '/admin' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  GENERAR CERTIFICADOS
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-all"
                >
                  CERRAR SESIÓN
                </button>
              </>
            ) : (
              location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-3 py-2.5 rounded-xl transition-colors"
                  title="Acceso Privado"
                >
                  INICIAR SESIÓN
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <div className={`${fullWidth ? "w-full flex-grow px-4 sm:px-6 lg:px-8 max-w-[98%] mx-auto" : "container mx-auto px-4 sm:px-6 lg:px-8"}`}>
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
