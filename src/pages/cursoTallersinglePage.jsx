import React, { useEffect, useState } from 'react'
import { Layout } from '../components/layout'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'

export const CursoTallersinglePage = () => {
    const { id } = useParams()
    const [cursoTaller, setCursoTaller] = useState(null)
    

    useEffect(() => {
        const fetchCursoTaller = async () => {
            const { data, error } = await supabase.from("cursos_talleres").select("*").eq("id", id)
            if (!error) {
                setCursoTaller(data[0])
            }
        }
        fetchCursoTaller()
    }, [id])
  return (
    <Layout>
        <div>
            {
                cursoTaller ? (
                    <div className="max-w-4xl mx-auto mt-12">
                        <div className="flex justify-center items-center">
                            <img src={cursoTaller.image} className='w-full rounded-md hero-shadow' alt={cursoTaller.titulo} />
                        </div>
                        <div className="flex flex-col justify-center items-center mt-24">
                            <h1 className="text-2xl font-bold text-slate-500 uppercase text-center">{cursoTaller.titulo}</h1>
                            <div className="flex justify-center items-center mt-12 gap-4">
                                <span className="text-slate-400 text-xs uppercase "><b>Fecha:</b> <span className="">{cursoTaller.fecha_emision}</span></span>
                                <span className="text-slate-400 text-xs uppercase "><b>Dictado por:</b> <span className="">{cursoTaller.dictado_por}</span></span>
                                <span className="text-slate-400 text-xs uppercase "><b>Tipo:</b> <span className="">{cursoTaller.tipo}</span></span>
                                <span className="text-slate-400 text-xs uppercase "><b>Duración:</b> <span className="">{cursoTaller.tiempo} {cursoTaller.tipo_tiempo}</span></span>
                            </div>
                            <span className="text-slate-400 text-xs uppercase mt-6"><b>Contenido de este curso </b></span>
                            <div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
                                {
                                    cursoTaller.temas.map((tema, index) => (
                                        <span key={index} className="text-slate-400 text-xs uppercase bg-slate-200 px-2 py-1 rounded-full">{tema}</span>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="mt-12 p-6 ">
                            <h2 className="text-xl font-semibold text-slate-500 mb-4 uppercase">Descripción del {cursoTaller.tipo}</h2>
                            <div 
                                className="prose max-w-none text-slate-600"
                                dangerouslySetInnerHTML={{ __html: cursoTaller.descripcion }}
                            />
                        </div>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )
            }
        </div>
    </Layout>
  )
}
