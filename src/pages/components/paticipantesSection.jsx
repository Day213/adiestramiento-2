import React from "react";


export const PaticipantesSection = ({ participantes, setParticipantes }) => {

  const handleAddParticipant = () => {
    setParticipantes((prev) => [
      ...prev,
      { name: "", cedula: "", folio: "", libro: "", reglon: "" },
    ]);
  };

  const handleRemoveParticipant = (index) => {
    setParticipantes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
        <div className="flex items-center gap-2">
          <span className="flex justify-center items-center bg-emerald-100 rounded-lg w-8 h-8 font-bold text-emerald-700 text-sm">
            {participantes.length}
          </span>
          <h2 className="font-bold text-slate-700 text-lg uppercase tracking-wide">
            Participantes
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAddParticipant}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 shadow-lg px-4 py-2 rounded-xl font-bold text-white text-sm transition-all transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar
        </button>
      </div>

      <div className="gap-4 grid grid-cols-1">
        {participantes.map((participant, index) => (
          <div key={index} className="relative bg-white shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-200 p-6 rounded-2xl transition-all group animate-in slide-in-from-bottom-2 duration-300">
            <div className="top-4 right-4 absolute">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleRemoveParticipant(index)}
                className="hover:bg-red-50 p-1.5 rounded-lg text-slate-300 hover:text-red-500 transition-all disabled:opacity-0"
                title="Eliminar participante"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-12 items-end">
              <div className="md:col-span-5">
                <label className="block mb-1.5 font-semibold text-slate-600 text-xs uppercase" htmlFor={`name-${index}`}>
                  Nombre Completo
                </label>
                <input
                  id={`name-${index}`}
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="bg-emerald-50 px-4 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none font-semibold placeholder:text-emerald-300"
                  value={participant.name}
                  onChange={(e) =>
                    setParticipantes((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, name: e.target.value } : p))
                    )
                  }
                />
              </div>

              <div className="md:col-span-3">
                <label className="block mb-1.5 font-semibold text-slate-600 text-xs uppercase" htmlFor={`cedula-${index}`}>
                  Cédula
                </label>
                <input
                  id={`cedula-${index}`}
                  type="text"
                  placeholder="V-12345678"
                  className="bg-emerald-50 px-4 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold placeholder:text-emerald-300"
                  value={participant.cedula}
                  onChange={(e) =>
                    setParticipantes((prev) =>
                      prev.map((p, i) => (i === index ? { ...p, cedula: e.target.value } : p))
                    )
                  }
                />
              </div>

              <div className="md:col-span-4 gap-2 grid grid-cols-3">
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`libro-${index}`}>
                    Libro
                  </label>
                  <input
                    id={`libro-${index}`}
                    type="number"
                    className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                    value={participant.libro}
                    onChange={(e) =>
                      setParticipantes((prev) =>
                        prev.map((p, i) => (i === index ? { ...p, libro: e.target.value } : p))
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`folio-${index}`}>
                    Folio
                  </label>
                  <input
                    id={`folio-${index}`}
                    type="number"
                    className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                    value={participant.folio}
                    onChange={(e) =>
                      setParticipantes((prev) =>
                        prev.map((p, i) => (i === index ? { ...p, folio: e.target.value } : p))
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`reglon-${index}`}>
                    Reglón
                  </label>
                  <input
                    id={`reglon-${index}`}
                    type="number"
                    className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                    value={participant.reglon}
                    onChange={(e) =>
                      setParticipantes((prev) =>
                        prev.map((p, i) => (i === index ? { ...p, reglon: e.target.value } : p))
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
