import React from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { CursoTallerPage } from './cursoTallerPage'
export const EditarCursoyTaller = () => {
  const { id } = useParams()

  const [data, setData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const fetchCursoTaller = async () => {
      setIsLoading(true)
      setHasError(false)
      const { data, error } = await supabase
        .from('cursos_talleres')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching curso/taller:', error)
        setHasError(true)
        setData(null)
      } else if (!data) {
        setData(null)
      } else {
        setData(data)
      }
      setIsLoading(false)
    }

    fetchCursoTaller()
  }, [id])

  if (isLoading) {
    return <p className="mt-10 text-slate-400 text-center">Cargando...</p>
  }

  if (hasError) {
    return <p className="mt-10 text-red-500 text-center">Error al cargar los datos.</p>
  }

  if (!data) {
    return <p className="mt-10 text-slate-400 text-center">No se encontraron datos.</p>
  }

  return (
    <CursoTallerPage data={data} />
  )
}
