import React from 'react'

export const CursosTalleresItem = ({ item }) => {
  return (
    <div className="group relative shadow-xl hover:shadow-2xl p-4 pb-8 border border-slate-200 hover:border-blue-300/50 rounded-md transition-all duration-300 ease-in-out" id="card-item ">
      <div className="bg-slate-300 rounded-md w-full h-[200px] group-hover:scale-105 transition-transform duration-300 ease-in-out" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <h2 className="mt-4 font-bold text-slate-500 group-hover:text-blue-800 text-xl uppercase line-clamp-1">{item.titulo}</h2>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-slate-400 text-xs uppercase"><b>temas:</b> {item.temas.length}</span>
        <span className="text-slate-400 text-xs uppercase"><b>Dictado por:</b> {item.dictado_por}</span>
      </div>
      <p className="my-4 text-slate-400 text-sm line-clamp-2">{item?.descripcion}</p>
      <div className="bottom-3 absolute flex justify-between items-center mt-4 w-[90%]">
        <span className="text-slate-400 text-xs uppercase"><b>Duranción:</b> {item?.tiempo} {item?.tipo_tiempo}</span>
        <span className="text-slate-400 text-xs uppercase"><b>Fecha:</b> {item?.fecha_emision}</span>
      </div>
    </div>
  )
}
