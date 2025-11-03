import { Layout } from '../components/layout'
import { useState } from 'react'
import { supabase } from '../supabase'

import { InputArray } from './components/inputArray'

import { RichTextEditor } from '../components/RichTextEditor'
import { useNavigate } from 'react-router'
import React from 'react'

export const CursoTallerPage = ({ data }) => {

  const initialState = {
    tipo: 'curso',
    image: '',
    titulo: '',
    descripcion: '',
    tiempo: '',
    tipo_tiempo: '',
    dictado_por: '',
    temas: [],
    fecha_emision: new Date().toISOString().split('T')[0],
  }

  const [solicitud, setSolicitud] = useState(initialState)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (data) {
      setSolicitud(data)
    }
  }, [data])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (data) {
        const { error } = await supabase.from('cursos_talleres').update(solicitud).eq('id', data.id)
        if (error) { throw error }
      } else {
        const { error } = await supabase.from('cursos_talleres').insert([solicitud])
        if (error) { throw error }

      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setSolicitud(initialState)
      navigate(-1)
    }
  }




  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mt-12">
        <form onSubmit={onSubmit}>
          <div className="text-center">
            <h2 className="mb-4 font-bold text-slate-600 text-xl uppercase">{data ? 'Editar curso o taller' : 'Crear nuevo curso o taller'}</h2>
          </div>

          <div className="bg-white shadow-xl mt-4 p-6 rounded-lg text-left">

            <div className="mb-4">
              <label htmlFor="image" className="font-medium text-slate-400 text-sm" >Imágen URL</label>
              <input type="text" id="image" value={solicitud.image} placeholder="Introduzca una imágen para mostrar" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" onChange={(e) => setSolicitud({ ...solicitud, image: e.target.value })} />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="">
                <label htmlFor="tipo" className="font-medium text-slate-400 text-sm">Tipo de actividad</label>
                <select name="tipo" id="tipo" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" value={solicitud.tipo || ''} onChange={(e) => setSolicitud({ ...solicitud, tipo: e.target.value })}>
                  <option value="" disabled>Selecciona un tipo</option>
                  <option value="curso">Curso</option>
                  <option value="taller">Taller</option>
                </select>
              </div>
              <div className="">
                <label htmlFor="titulo" className="font-medium text-slate-400 text-sm">Título del curso o taller</label>
                <input type="text" id="titulo" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe el título aquí..." value={solicitud.titulo || ''} onChange={(e) => setSolicitud({ ...solicitud, titulo: e.target.value })} required />
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <label htmlFor="tiempo" className="font-medium text-slate-400 text-sm">Tiempo</label>
                <input type="number" id="tiempo" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe el tiempo aquí..." value={solicitud.tiempo || ''} onChange={(e) => setSolicitud({ ...solicitud, tiempo: e.target.value })} required />
              </div>
              <div className="">
                <label htmlFor="formato" className="font-medium text-slate-400 text-sm">Formato</label>
                <select name="tipo_tiempo" id="tipo_tiempo" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" value={solicitud.tipo_tiempo || ''} onChange={(e) => setSolicitud({ ...solicitud, tipo_tiempo: e.target.value })} required>
                  <option value="" disabled>Selecciona un formato</option>
                  <option value="horas">Horas</option>
                  <option value="dias">Dias</option>
                  <option value="semanas">Semanas</option>
                  <option value="años">Años</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 w-full">
              <div >
                <label htmlFor="fecha_emision" className="font-medium text-slate-400 text-sm">Fecha de emisión</label>
                <input type="date" id="fecha_emision" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe la fecha aquí..." value={solicitud.fecha_emision || ''} onChange={(e) => setSolicitud({ ...solicitud, fecha_emision: e.target.value })} />
              </div>
              <div className="w-full">
                <label htmlFor="dictado_por" className="font-medium text-slate-400 text-sm">Dictado por</label>
                <input type="text" id="dictado_por" className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400" placeholder="Escribe la fecha aquí..." value={solicitud.dictado_por || ''} onChange={(e) => setSolicitud({ ...solicitud, dictado_por: e.target.value })} />
              </div>
            </div>


            <div className="mb-4">
              <label htmlFor="temas" className="font-medium text-slate-400 text-sm">Temas</label>
              <InputArray
                onTagsChange={(newTags) => setSolicitud({ ...solicitud, temas: newTags })}
                label="temas"
                tagsDefault={data?.temas || []}
              />
            </div>

            <div className="mb-6 max-w-[800px]">
              <label className="block font-medium text-slate-400 text-sm mb-2">Descripción del {solicitud.tipo}</label>
              <RichTextEditor
                value={solicitud.descripcion || ''}
                onChange={(html) => setSolicitud({ ...solicitud, descripcion: html })}
              />
              <p className="mt-1 text-xs text-slate-400">
                Puedes usar negritas, cursivas y listas para formatear tu texto.
              </p>
            </div>

            <button className={`disabled:bg-slate-600 px-4 py-2 rounded-md font-bold text-white uppercase transition-all ${data ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-700'}`} >
              {data ? `Editar ${solicitud.tipo}` : `Crear nuevo ${solicitud.tipo}`}
            </button>

          </div>

        </form>

      </div>
    </Layout>
  )
}
