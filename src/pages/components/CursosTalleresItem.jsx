import React from 'react'
import { Link } from 'react-router-dom'

export const CursosTalleresItem = ({ item }) => {

  return (
    <Link to={`/curso-taller/${item.id}`}>
    <div className="group relative shadow-xl hover:shadow-2xl p-4 pb-8 border border-slate-200 hover:border-blue-300/50 rounded-md transition-all duration-300 ease-in-out cursor-pointer" id="card-item ">
      <div className="bg-slate-300 rounded-md w-full h-[200px] group-hover:scale-105 transition-transform duration-300 ease-in-out" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

      <span className={`${item.tipo === "curso" ? "bg-sky-500" : "bg-emerald-400"} text-white text-[8px] font-bold px-2 py-1 rounded-md uppercase absolute top-6 left-6`}>{item.tipo}</span>
      <h2 className="mt-4 font-bold text-slate-500 group-hover:text-blue-800 text-lg! uppercase line-clamp-1">{item.titulo}</h2>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-slate-400 text-xs uppercase"><b>temas:</b> <span className="text-sky-600 font-bold">{item.temas.length}</span></span>
        <span className="text-slate-400 text-xs uppercase line-clamp-1"><b>Dictado por:</b> <span className="text-sky-600 font-bold">{item.dictado_por}</span></span>
      </div>
      <p className="my-4 text-slate-400 text-sm line-clamp-2">
        {item?.descripcion ? item.descripcion.replace(/<[^>]*>?/gm, '') : ''}
      </p>
      <div className="bottom-3 absolute flex justify-between items-center mt-4 w-[90%]">
        <span className="text-slate-400 text-xs uppercase"><b>Duranción:</b> {item?.tiempo} {item?.tipo_tiempo}</span>
        <span className="text-slate-400 text-xs uppercase"><b>Fecha:</b> {item?.fecha_emision}</span>
      </div>
    </div>
    </Link>
  )
}
