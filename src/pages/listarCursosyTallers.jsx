import { Layout } from "../components/layout"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { CursosTalleresItem } from "./components/CursosTalleresItem"

export const ListarCursosyTallers = () => {

  const [cursosytalleres, setCursosYTalleres] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCursosYTalleres = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("cursos_talleres").select("*")
      if (!error) setCursosYTalleres(data)
      setLoading(false)
    }
    fetchCursosYTalleres()
  }, [])

  console.log(cursosytalleres)
  return (
    <Layout>
      <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container">
        {
          loading ? ("Cargando") : (
            cursosytalleres.map((item) => (
              <CursosTalleresItem item={item} key={item.id} />
            ))
          )
        }
      </div>
    </Layout>
  )
}
