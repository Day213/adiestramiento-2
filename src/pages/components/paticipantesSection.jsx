import React from "react";

export const PaticipantesSection = ({participantes, setParticipantes}) => {

  const handleAddParticipant = () => {
    setParticipantes((prev) => [
      ...prev,
      { name: "", cedula: "", folio: "", reglon: "" },
    ]);
  };

  const handleRemoveParticipant = (index) => {
    setParticipantes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center text-center">
        <h2 className="font-bold text-slate-500 text-xl uppercase">
          Participantes {participantes.length}
        </h2>
        <button
          type="button"
          onClick={handleAddParticipant}
          className="bg-blue-200 p-1 px-3 rounded-md text-slate-600 uppercase transition-colors duration-200"
        >
          Agregar participante
        </button>
      </div>
      {participantes.map((participant, index) => (
        <div key={index} className="flex gap-4 mt-6 items-center">
          <div className="flex flex-col">
            <label
              className="block mb-2 font-bold text-gray-700 text-sm"
              htmlFor="participante"
            >
              Nombre
            </label>
            <input
              type="text"
              className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
              value={participant.name}
              onChange={(e) =>
                setParticipantes((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, name: e.target.value } : p))
                )
              }
              id="participante"
            />
          </div>
          <div className="flex flex-col w-1/4">
            <label
              className="block mb-2 font-bold text-gray-700 text-sm"
              htmlFor="cedula"
            >
              Cédula
            </label>
            <input
              type="text"
              className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
              value={participant.cedula}
              onChange={(e) =>
                setParticipantes((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, cedula: e.target.value } : p))
                )
              }
              id="cedula"
            />
          </div>
          <div className="flex flex-col w-1/6">
            <label
              className="block mb-2 font-bold text-gray-700 text-sm"
              htmlFor="libro"
            >
              Núm libro
            </label>
            <input
              type="number"
              className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
              value={participant.libro}
              onChange={(e) =>
                setParticipantes((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, libro: e.target.value } : p))
                )
              }
              id="libro"
            />
          </div>
          <div className="flex flex-col w-1/6">
            <label
              className="block mb-2 font-bold text-gray-700 text-sm"
              htmlFor="folio"
            >
              núm folio
            </label>
            <input
              type="number"
              className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
              value={participant.folio}
              onChange={(e) =>
                setParticipantes((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, folio: e.target.value } : p))
                )
              }
              id="folio"
            />
          </div>
          <div className="flex flex-col w-1/6">
            <label
              className="block mb-2 font-bold text-gray-700 text-sm"
              htmlFor="reglon"
            >
              Reglón
            </label>
            <input
              type="number"
              className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
              value={participant.reglon}
              onChange={(e) =>
                setParticipantes((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, reglon: e.target.value } : p))
                )
              }
              id="reglon"
            />
          </div>
          <div className="flex items-center h-[40px]  -mb-7">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => handleRemoveParticipant(index)}
              className="bg-slate-200 p-1 px-2 text-slate-600 uppercase transition-colors duration-200 rounded-full text-xs disabled:opacity-50"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
