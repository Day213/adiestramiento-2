import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";


export const PaticipantesSection = ({ participantes, setParticipantes, showErrors }) => {
  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleAddParticipant = () => {
    setParticipantes((prev) => [
      ...prev,
      { name: "", cedula: "", folio: "", libro: "", reglon: "" },
    ]);
    const newTotalPages = Math.ceil((participantes.length + 1) / ITEMS_PER_PAGE);
    setCurrentPage(newTotalPages);
  };

  const handleRemoveParticipant = (index) => {
    setParticipantes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    if (window.confirm("¿Está seguro de que desea eliminar a todos los participantes? Esta acción no se puede deshacer y limpiará la lista.")) {
      setParticipantes([{ name: "", cedula: "", folio: "", libro: "", reglon: "" }]);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [["Nombre Completo", "Cédula", "Libro", "Folio", "Reglón"]];
    
    // Filtrar participantes con datos ingresados
    const participantesValidos = participantes.filter(
      (p) =>
        (p.name && p.name.trim() !== "") || (p.cedula && p.cedula.trim() !== "")
    );

    let rows = [];
    if (participantesValidos.length > 0) {
      rows = participantesValidos.map((p) => [
        p.name || "",
        p.cedula || "",
        p.libro || "",
        p.folio || "",
        p.reglon || "",
      ]);
    } else {
      rows = [
        ["Juan Pérez", "V-12345678", "5", "12", "34"],
        ["María Gómez", "E-87654321", "5", "12", "35"]
      ];
    }
    
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(headers.concat(rows));
      XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
      XLSX.writeFile(wb, "plantilla_participantes.xlsx");
    } catch (error) {
      console.error("Error al generar la plantilla:", error);
      alert("No se pudo descargar la plantilla");
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    const isCsv = fileName.endsWith(".csv");

    if (!isExcel && !isCsv) {
      alert("Por favor, seleccione un archivo con formato .xlsx, .xls o .csv");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Obtener la primera hoja de trabajo
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir la hoja a formato JSON (matriz de matrices)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          alert("El archivo está vacío o no tiene el formato correcto.");
          return;
        }

        // Buscar encabezados en la primera fila
        const rawHeaders = jsonData[0];
        const headers = rawHeaders.map(h => {
          if (h === undefined || h === null) return "";
          let cleaned = String(h).trim().replace(/^["']|["']$/g, "").trim();
          return cleaned.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        });

        const nameIndex = headers.findIndex(h => h.includes("nombre"));
        const cedulaIndex = headers.findIndex(h => h.includes("cedula"));
        const libroIndex = headers.findIndex(h => h.includes("libro"));
        const folioIndex = headers.findIndex(h => h.includes("folio"));
        const reglonIndex = headers.findIndex(h => h.includes("reglon") || h.includes("renglon"));

        if (nameIndex === -1 || cedulaIndex === -1) {
          alert("El archivo debe contener al menos las columnas 'Nombre Completo' y 'Cédula'.");
          return;
        }

        const newParticipants = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const name = nameIndex !== -1 && row[nameIndex] !== undefined ? String(row[nameIndex]).trim() : "";
          const cedula = cedulaIndex !== -1 && row[cedulaIndex] !== undefined ? String(row[cedulaIndex]).trim() : "";
          const libro = libroIndex !== -1 && row[libroIndex] !== undefined ? String(row[libroIndex]).trim() : "";
          const folio = folioIndex !== -1 && row[folioIndex] !== undefined ? String(row[folioIndex]).trim() : "";
          const reglon = reglonIndex !== -1 && row[reglonIndex] !== undefined ? String(row[reglonIndex]).trim() : "";

          if (name || cedula) {
            newParticipants.push({ name, cedula, libro, folio, reglon });
          }
        }

        if (newParticipants.length === 0) {
          alert("No se encontraron registros de participantes válidos en el archivo.");
          return;
        }

        setParticipantes(newParticipants);
        setCurrentPage(1);
        alert(`Se importaron exitosamente ${newParticipants.length} participantes.`);
      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        alert("Ocurrió un error al leer y procesar el archivo.");
      } finally {
        e.target.value = "";
      }
    };

    reader.onerror = () => {
      alert("Ocurrió un error al leer el archivo.");
      e.target.value = "";
    };

    reader.readAsArrayBuffer(file);
  };

  const hasParticipantsData = participantes.length > 1 || 
    (participantes[0] && (
      (participantes[0].name && participantes[0].name.trim() !== "") || 
      (participantes[0].cedula && participantes[0].cedula.trim() !== "") || 
      participantes[0].folio || 
      participantes[0].libro || 
      participantes[0].reglon
    ));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100/50 p-3 sm:p-4 rounded-xl border border-slate-200/50">
        <div className="flex items-center gap-2">
          <span className="flex justify-center items-center bg-emerald-100 rounded-lg w-8 h-8 font-bold text-emerald-700 text-sm">
            {participantes.length}
          </span>
          <h2 className="font-bold text-slate-700 text-sm sm:text-lg uppercase tracking-wide">
            Participantes
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-600 hover:bg-slate-700 shadow-slate-500/10 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-white text-xs sm:text-sm transition-all transform active:scale-95"
            title="Descargar plantilla de Excel (.xlsx) para llenado masivo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Plantilla
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-white text-xs sm:text-sm transition-all transform active:scale-95"
            title="Importar participantes desde un archivo Excel o CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-5-4l3-3m0 0l3 3m-3-3v12" />
            </svg>
            Cargar Lista
          </button>
          {hasParticipantsData && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 sm:gap-2 bg-rose-600 hover:bg-rose-700 shadow-rose-500/10 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-white text-xs sm:text-sm transition-all transform active:scale-95 animate-in fade-in zoom-in-95 duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={handleAddParticipant}
            className="flex items-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 shadow-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-white text-xs sm:text-sm transition-all transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>
      </div>

      {/* Paginación variables */}
      {(() => {
        const totalPages = Math.max(1, Math.ceil(participantes.length / ITEMS_PER_PAGE));
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedParticipants = participantes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return (
          <>
            <div className="gap-4 grid grid-cols-1">
              {paginatedParticipants.map((participant, localIndex) => {
                const globalIndex = startIndex + localIndex;
                return (
                  <div key={globalIndex} className="relative bg-white shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-200 p-4 sm:p-6 pr-10 sm:pr-6 rounded-2xl transition-all group animate-in slide-in-from-bottom-2 duration-300">
                    <div className="top-4 right-4 absolute">
                      <button
                        type="button"
                        disabled={globalIndex === 0}
                        onClick={() => handleRemoveParticipant(globalIndex)}
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
                        <label className="block mb-1.5 font-semibold text-slate-600 text-xs uppercase" htmlFor={`name-${globalIndex}`}>
                          Nombre Completo
                        </label>
                        <input
                          id={`name-${globalIndex}`}
                          type="text"
                          placeholder="Ej: Juan Pérez"
                          className={`px-4 py-2 border-2 rounded-xl focus:ring-4 w-full text-slate-900 transition-all outline-none font-semibold ${
                            showErrors && (!participant.name || !participant.name.trim())
                              ? "bg-rose-50/50 border-rose-500 focus:border-rose-600 focus:ring-rose-500/10 placeholder:text-rose-300"
                              : "bg-emerald-50 border-emerald-200 focus:border-emerald-600 focus:ring-emerald-500/10 placeholder:text-emerald-300"
                          }`}
                          value={participant.name}
                          onChange={(e) =>
                            setParticipantes((prev) =>
                              prev.map((p, i) => (i === globalIndex ? { ...p, name: e.target.value } : p))
                            )
                          }
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block mb-1.5 font-semibold text-slate-600 text-xs uppercase" htmlFor={`cedula-${globalIndex}`}>
                          Cédula
                        </label>
                        <input
                          id={`cedula-${globalIndex}`}
                          type="text"
                          placeholder="V-12345678"
                          className={`px-4 py-2 border-2 rounded-xl focus:ring-4 w-full text-slate-900 transition-all outline-none text-center font-semibold ${
                            showErrors && (!participant.cedula || !participant.cedula.trim())
                              ? "bg-rose-50/50 border-rose-500 focus:border-rose-600 focus:ring-rose-500/10 placeholder:text-rose-300"
                              : "bg-emerald-50 border-emerald-200 focus:border-emerald-600 focus:ring-emerald-500/10 placeholder:text-emerald-300"
                          }`}
                          value={participant.cedula}
                          onChange={(e) =>
                            setParticipantes((prev) =>
                              prev.map((p, i) => (i === globalIndex ? { ...p, cedula: e.target.value } : p))
                            )
                          }
                        />
                      </div>

                      <div className="md:col-span-4 gap-2 grid grid-cols-3">
                        <div>
                          <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`libro-${globalIndex}`}>
                            Libro
                          </label>
                          <input
                            id={`libro-${globalIndex}`}
                            type="number"
                            className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                            value={participant.libro}
                            onChange={(e) =>
                              setParticipantes((prev) =>
                                prev.map((p, i) => (i === globalIndex ? { ...p, libro: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`folio-${globalIndex}`}>
                            Folio
                          </label>
                          <input
                            id={`folio-${globalIndex}`}
                            type="number"
                            className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                            value={participant.folio}
                            onChange={(e) =>
                              setParticipantes((prev) =>
                                prev.map((p, i) => (i === globalIndex ? { ...p, folio: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5 font-semibold text-slate-600 text-[10px] uppercase truncate" htmlFor={`reglon-${globalIndex}`}>
                            Reglón
                          </label>
                          <input
                            id={`reglon-${globalIndex}`}
                            type="number"
                            className="bg-emerald-50 px-2 py-2 border-2 border-emerald-200 focus:border-emerald-600 rounded-xl focus:ring-4 focus:ring-emerald-500/10 w-full text-slate-900 transition-all outline-none text-center font-semibold"
                            value={participant.reglon}
                            onChange={(e) =>
                              setParticipantes((prev) =>
                                prev.map((p, i) => (i === globalIndex ? { ...p, reglon: e.target.value } : p))
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controles de Paginación */}
            {participantes.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/60 mt-6 gap-4 shadow-sm select-none animate-in fade-in duration-200">
                <div className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                  Mostrando <span className="text-blue-600 font-extrabold">{startIndex + 1}</span> - <span className="text-blue-600 font-extrabold">{Math.min(startIndex + ITEMS_PER_PAGE, participantes.length)}</span> de <span className="text-slate-800 font-extrabold">{participantes.length}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  >
                    Siguiente
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
};
