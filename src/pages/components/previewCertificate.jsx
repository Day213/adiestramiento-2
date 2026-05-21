import React, { useState } from "react";

export const PreviewCertificate = ({ formData, participantes }) => {
  const [view, setView] = useState("front"); // "front" or "back"

  // Get the first participant or use a placeholder
  const activeParticipant =
    participantes &&
    participantes[0] &&
    (participantes[0].name || participantes[0].cedula)
      ? participantes[0]
      : {
          name: "JUAN PÉREZ",
          cedula: "V-12.345.678",
          libro: "5",
          folio: "12",
          reglon: "34",
        };

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  };

  const getFormattedDate = (dateStr) => {
    try {
      const date = parseLocalDate(dateStr);
      return {
        day: date.toLocaleString("es-ES", { day: "2-digit" }),
        month: date.toLocaleString("es-ES", { month: "long" }),
        year: date.getFullYear(),
      };
    } catch (e) {
      return { day: "20", month: "mayo", year: "2026" };
    }
  };

  const dateEmision = getFormattedDate(formData.dia_emision);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl p-4 sm:p-6 rounded-3xl lg:sticky lg:top-24 sticky top-12 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Vista Previa
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight mt-0.5">
            Muestra del primer participante
          </p>
        </div>

        {/* Front/Back Selector */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
          <button
            type="button"
            onClick={() => setView("front")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              view === "front"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => setView("back")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              view === "back"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dorso
          </button>
        </div>
      </div>

      {/* Certificate Sheet (Simulates standard letter landscape ratio ~ 1.414) */}
      <div className="relative w-full aspect-[1.414/1] bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden select-none select-none-all">
        {/* FRONT VIEW */}
        {view === "front" ? (
          <div className="relative w-full h-full p-[4%] flex flex-col justify-between font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/background.png"
                alt="Fondo"
                className="w-full h-full object-fill opacity-95"
              />
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <img
                src="/francisco-miranda.png"
                alt="Marca de agua"
                className="w-[60%] h-auto object-contain opacity-[0.06] select-none"
              />
            </div>

            {/* Content Container (elevated above background) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between text-center select-none text-[8px] sm:text-[10px] md:text-[11px] lg:text-[7px] xl:text-[10px] 2xl:text-[12px]">
              {/* Header Logo */}
              <div className="w-[85%] mx-auto mb-1">
                <img
                  src="/mebrete.png"
                  alt="Mebrete"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Header Institutional Text */}
              <div className="text-slate-700 leading-tight w-[90%] mx-auto font-medium mb-1">
                Universidad Nacional Experimental Francisco de Miranda
                Vicerrectorado Administrativo Dirección de Recursos Humanos
                Departamento de Adiestramiento
              </div>

              {/* Award Title */}
              <div className="text-slate-800 font-extrabold uppercase tracking-wide my-1">
                Otorga el presente certificado a:
              </div>

              {/* Participant Name */}
              <div className="text-slate-900 font-serif font-bold italic tracking-wide text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-lg text-blue-900 border-b border-blue-100 pb-0.5 max-w-[80%] mx-auto leading-none mb-0.5 uppercase">
                {activeParticipant.name || "JUAN PÉREZ"}
              </div>

              {/* Cédula */}
              <div className="text-slate-700 font-bold italic font-serif mb-1 leading-none">
                C.I: {activeParticipant.cedula || "V-12.345.678"}
              </div>

              {/* Body Text */}
              <div className="text-slate-600 text-left leading-relaxed w-[92%] mx-auto bg-slate-50/40 p-1.5 rounded-lg border border-slate-100/50 mb-1">
                En calidad de{" "}
                <span className="font-bold text-slate-800 uppercase">
                  {formData.rol || "participante"}
                </span>{" "}
                en el{" "}
                <span className="font-bold text-slate-800 uppercase">
                  {formData.tipo_solicitud || "taller"}
                </span>
                :{" "}
                <span className="font-bold text-slate-900">
                  {formData.nombre_solicitud || "[Nombre del Taller/Curso]"}
                </span>{" "}
                (MODALIDAD{" "}
                <span className="font-bold text-slate-800 uppercase">
                  {formData.modalidad || "presencial"}
                </span>
                ). Evento realizado en{" "}
                <span className="font-semibold text-slate-700">
                  {formData.instalaciones || "Este instituto"}
                </span>{" "}
                el día{" "}
                <span className="font-medium text-slate-700">
                  {dateEmision.day} de {dateEmision.month} de {dateEmision.year}
                </span>
                . Duración:{" "}
                <span className="font-bold text-slate-700">
                  {formData.duracion || "[Especificar duración]"}
                </span>
              </div>

              {/* Signatures Row */}
              <div className="grid grid-cols-3 gap-2 items-end pt-1">
                {/* Jefe de Adiestramiento */}
                <div className="flex flex-col items-center">
                  <div className="h-6 sm:h-8 md:h-10 lg:h-6 xl:h-8 flex items-end">
                    <img
                      src="/eydis-martinez.png"
                      alt="Firma"
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="w-[80%] border-t border-slate-300 mt-0.5"></div>
                  <span className="font-bold text-slate-800 leading-tight">
                    Ing. Eydis Martinez
                  </span>
                  <span className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[5px] xl:text-[8px] text-slate-500 leading-tight text-center max-w-[80%]">
                    Jefe del dpto. de Adiestramiento
                  </span>
                </div>

                {/* Vicerrector */}
                <div className="flex flex-col items-center">
                  <div className="h-6 sm:h-8 md:h-10 lg:h-6 xl:h-8 flex items-end">
                    <img
                      src="/jose.png"
                      alt="Firma"
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="w-[80%] border-t border-slate-300 mt-0.5"></div>
                  <span className="font-bold text-slate-800 leading-tight">
                    Licdo. José Ramírez
                  </span>
                  <span className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[5px] xl:text-[8px] text-slate-500 leading-tight text-center max-w-[80%]">
                    Vicerrector Administrativo
                  </span>
                </div>

                {/* Recursos Humanos */}
                <div className="flex flex-col items-center">
                  <div className="h-6 sm:h-8 md:h-10 lg:h-6 xl:h-8 flex items-end">
                    <img
                      src="/natalifirma.png"
                      alt="Firma"
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="w-[80%] border-t border-slate-300 mt-0.5"></div>
                  <span className="font-bold text-slate-800 leading-tight">
                    Dra. Natali Galicia
                  </span>
                  <span className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[5px] xl:text-[8px] text-slate-500 leading-tight text-center max-w-[80%]">
                    Directora de Recursos Humanos
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* BACK VIEW */
          <div className="relative w-full h-full p-[4%] flex flex-col justify-between font-sans bg-slate-50">
            {/* Header / Info Row */}
            <div className="relative z-10 flex justify-between gap-4 text-[7px] sm:text-[9px] md:text-[10px] lg:text-[6px] xl:text-[9px]">
              <div className="flex-1 space-y-1">
                <span className="text-blue-600 font-bold hover:underline cursor-pointer block">
                  Verificar documento aquí
                </span>
                <span className="block text-slate-400 font-mono text-[6px] sm:text-[7px] md:text-[8px] lg:text-[5px] xl:text-[7px] break-all max-w-[70%] bg-slate-100 p-1 rounded border border-slate-200/50">
                  Token: CERT-{activeParticipant.cedula || "V-12345678"}
                  -1716223287...
                </span>
              </div>

              {/* QR Code Graphic Representation */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-12 lg:h-12 xl:w-16 xl:h-16 border border-slate-200 bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                {/* Techy Mock QR Code Grid */}
                <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-full h-full p-0.5 bg-slate-50">
                  <div className="bg-slate-900 rounded-[2px] col-span-2 row-span-2"></div>
                  <div className="bg-slate-300 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px] col-start-4 col-span-2 row-span-2"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-300 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-300 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px] col-span-2 row-span-2"></div>
                  <div className="bg-slate-300 rounded-[2px]"></div>
                  <div className="bg-slate-900 rounded-[2px]"></div>
                  <div className="bg-slate-300 rounded-[2px]"></div>
                </div>
              </div>
            </div>

            {/* Contenido / Temario Block */}
            <div className="relative z-10 flex-1 my-2 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[7px] xl:text-[10px]">
              <h4 className="font-extrabold text-slate-800 border-b border-slate-200 pb-0.5 uppercase mb-1 tracking-wider">
                Contenido del Programa
              </h4>

              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 max-h-[70px] overflow-hidden text-slate-600 font-medium">
                {formData.contenido && formData.contenido.length > 0 ? (
                  formData.contenido.slice(0, 8).map((item, idx) => (
                    <div key={idx} className="truncate flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {idx + 1}. {item}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="truncate flex items-center gap-1 opacity-45">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      1. Introducción y Conceptos Básicos
                    </div>
                    <div className="truncate flex items-center gap-1 opacity-45">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      2. Módulos y Flujos de Datos Principales
                    </div>
                    <div className="truncate flex items-center gap-1 opacity-45">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      3. Prácticas Clínicas e Integración de Proyectos
                    </div>
                    <div className="truncate flex items-center gap-1 opacity-45">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      4. Evaluación Final y Cierre del Programa
                    </div>
                  </>
                )}
                {formData.contenido && formData.contenido.length > 8 && (
                  <div className="text-slate-400 italic text-[7px] col-span-2">
                    + {formData.contenido.length - 8} temas adicionales...
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer & Table Row */}
            <div className="relative z-10 flex justify-between items-end gap-4">
              {/* Institutional Footer Image */}
              <div className="w-[60%] mb-1">
                <img
                  src="/footer.jpg"
                  alt="Footer Logo"
                  className="w-full h-auto object-contain rounded-[4px]"
                />
              </div>

              {/* Registro Table */}
              <div className="text-[6px] sm:text-[8px] md:text-[9px] lg:text-[5px] xl:text-[8px] w-[35%]">
                {/* Table Header Row */}
                <div className="grid grid-cols-3 gap-1 text-center font-extrabold text-slate-500 mb-0.5 tracking-tight uppercase">
                  <span>N° Libro</span>
                  <span>Folio</span>
                  <span>Renglón</span>
                </div>
                {/* Table Cells */}
                <div className="grid grid-cols-3 gap-1 text-center font-bold text-slate-800">
                  <div className="bg-white border border-slate-200 py-0.5 rounded">
                    {activeParticipant.libro || "5"}
                  </div>
                  <div className="bg-white border border-slate-200 py-0.5 rounded">
                    {activeParticipant.folio || "12"}
                  </div>
                  <div className="bg-white border border-slate-200 py-0.5 rounded">
                    {activeParticipant.reglon || "34"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
