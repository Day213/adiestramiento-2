import React, { useState, useEffect } from 'react'
import { Layout } from '../components/layout'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { PaginatedTable } from '../components/PaginatedTable'
import { Link } from 'react-router-dom'

export const CensadosPage = () => {
  const { cursoId } = useParams()
  const [censados, setCensados] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [cursoTitulo, setCursoTitulo] = useState('')

  useEffect(() => {
    const fetchCursoAndCensados = async () => {
      setLoading(true)

      // Fetch curso details
      const { data: cursoData, error: cursoError } = await supabase
        .from('cursos_talleres')
        .select('titulo')
        .eq('id', cursoId)
        .single()

      if (cursoError) {
        console.error('Error fetching curso title:', cursoError)
        setCursoTitulo('Curso Desconocido')
      } else if (cursoData) {
        setCursoTitulo(cursoData.titulo)
      }

      // Fetch censados
      const { data: censadosData, error: censadosError } = await supabase
        .from('censo')
        .select('*')
        .eq('curso_taller', cursoId)

      if (censadosError) {
        console.error('Error fetching censados:', censadosError)
      } else {
        setCensados(censadosData)
      }
      setLoading(false)
    }

    if (cursoId) {
      fetchCursoAndCensados()
    }
  }, [cursoId])

  const columns = [
    { label: "Nombre", key: "nombre" },
    { label: "Cédula", key: "cedula" },
    { label: "Correo", key: "correo" },
    { label: "Teléfono", key: "telefono" },
    { label: "Fecha de Censo", key: "created_at" },
  ]

  const renderRow = (item) => {
    const fechaCorta = item.created_at
      ? new Date(item.created_at).toISOString().slice(0, 10)
      : ""
    return (
      <tr key={item.id} className="text-slate-500">
        <td className="px-4 py-2 border-slate-300 border-b font-bold text-slate-600 text-left text-nowrap">
          {item.nombre}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          {item.cedula}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          {item.correo}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          {item.telefono}
        </td>
        <td className="px-4 py-2 border-slate-300 border-b">
          {fechaCorta}
        </td>
      </tr>
    )
  }

  return (
    <Layout>
      <div className="bg-white shadow-md mt-4 p-6 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="mb-4 font-bold text-slate-500 text-2xl uppercase">Censados para: <span className="">{cursoTitulo} {censados.length}</span></h3>
          <Link to="/listar-solicitudes?tab=cursos" >
            <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-bold text-white text-sm uppercase">Volver a Solicitudes</button>
          </Link>
        </div>
        {loading ? (
          <p>Cargando participantes...</p>
        ) : (censados.length === 0 ? (
          <p>No hay participantes censados para este curso aún.</p>
        ) : (
          <div className="bg-slate-50 mt-4 p-4 rounded-md">
            <PaginatedTable
              data={censados}
              renderRow={renderRow}
              columns={columns}
              rowsPerPage={10}
              pageState={currentPage}
              setPageState={setCurrentPage}
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}

