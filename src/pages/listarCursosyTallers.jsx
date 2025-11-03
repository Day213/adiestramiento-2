import { Layout } from "../components/layout"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { CursosTalleresItem } from "./components/CursosTalleresItem"

export const ListarCursosyTallers = () => {
  const [cursosytalleres, setCursosYTalleres] = useState([])
  const [filteredCursos, setFilteredCursos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('todos') // 'todos', 'cursos', 'talleres'

  // Fetch data
  useEffect(() => {
    const fetchCursosYTalleres = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("cursos_talleres").select("*")
      if (!error) {
        setCursosYTalleres(data)
        setFilteredCursos(data)
      }
      setLoading(false)
    }
    fetchCursosYTalleres()
  }, [])

  // Apply filter and date check
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time part to compare only dates

    let filtered = [...cursosytalleres];
    
    // Filter by type if not 'todos'
    if (filter !== 'todos') {
      filtered = filtered.filter(item => item.tipo === filter);
    }
    
    // Filter out past events
    filtered = filtered.filter(item => {
      if (!item.fecha_emision) return false; // Skip if no date is set
      
      try {
        const eventDate = new Date(item.fecha_emision);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      } catch (e) {
        console.error('Error parsing date:', item.fecha_emision, e);
        return false;
      }
    });
    
    // Sort by date (nearest first)
    filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.fecha_emision);
        const dateB = new Date(b.fecha_emision);
        return dateA - dateB;
      } catch (e) {
        console.error('Error parsing date:', a.fecha_emision, e);
        return 0;
      }
    });
    
    setFilteredCursos(filtered);
  }, [filter, cursosytalleres])

  
  return (
    <Layout>
      <div className="container mt-8">
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setFilter('todos')}
            className={`px-4 py-1 rounded-md border uppercase bg-white text-slate-400 border-slate-300 ${filter === 'todos' && 'text-white bg-blue-500!' }`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('curso')}
            className={`px-4 py-1 rounded-md border uppercase bg-white text-slate-400 border-slate-300 ${filter === 'curso' && 'text-white bg-blue-500!'}`}
          >
            Cursos
          </button>
          <button 
            onClick={() => setFilter('taller')}
            className={`px-4 py-1 rounded-md border uppercase bg-white text-slate-400 border-slate-300 ${filter === 'taller' && 'text-white bg-blue-500!'}`}
          >
            Talleres
          </button>
        </div>
      </div>
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mt-4">
        {
          loading ? ("Cargando") : (
            filteredCursos.map((item) => (
              <>
              {
                item.estatus ? (
                  <CursosTalleresItem item={item} key={item.id} />
                ) : null
              }
              </>
            ))
          )
        }
      </div>
      
    </Layout>
  )
}
