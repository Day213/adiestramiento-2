import React, { useState, useEffect } from "react";
import { SignJWT } from "jose"; // Changed from 'jsonwebtoken'
import { Layout } from "../components/layout";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import { InputArray } from "./components/inputArray";
import { generatePDFsForParticipants } from "./components/PDFGenerator";
import { generateQRCodeDataUrl } from "./components/QRCodeGenerator";
import { PaticipantesSection } from "./components/paticipantesSection";
import { PreviewCertificate } from "./components/previewCertificate";

export const CrearCertificado = () => {
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState({
    tipo_solicitud: "curso/taller",
  });
  const [loading, setLoading] = useState(false);
  const [participantes, setParticipantes] = useState([
    { name: "", cedula: "", rol: "participante", folio: "", libro: "", reglon: "" },
  ]);
  const [toast, setToast] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [downloadExcelAlso, setDownloadExcelAlso] = useState(true);

  useEffect(() => {
    console.log("🔥 [CAVEMAN-ULTRA] Toast effect triggered. Current toast state:", toast);
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [formData, setFormData] = useState({
    nombre_solicitud: "",
    duracion: "",
    fecha_inicial: new Date().toISOString().split("T")[0],
    instalaciones: "Este instituto",
    dia_emision: new Date().toISOString().split("T")[0],
    tipo_solicitud: "taller",
    modalidad: "presencial",
    rol: "participante",
    contenido: [],
    participante: [],
  });

  useEffect(() => {
    console.log("🔥 [CAVEMAN-ULTRA] Syncing participants with formData. New participantes list:", participantes);
    setFormData((prevData) => ({
      ...prevData,
      participante: participantes,
    }));
  }, [participantes]);

  const handleSubmit = async (e) => {
    console.log("🔥 [CAVEMAN-ULTRA] handleSubmit triggered with event:", e);
    e.preventDefault();
  };

  const handleDuracionChange = (value, type) => {
    console.log("🔥 [CAVEMAN-ULTRA] handleDuracionChange input received. value:", value, "type:", type);
    // Validar que no sea negativo ni excesivamente grande
    const numValue = parseInt(value);
    if (value !== "" && (numValue < 1 || numValue > 999)) return;

    let finalType = type;
    if (numValue === 1) {
      if (type === "dias") finalType = "dia";
      if (type === "meses") finalType = "mes";
      if (type === "años") finalType = "año";
    }

    setFormData((prevData) => ({
      ...prevData,
      duracion: value ? `${value} ${finalType}` : "",
    }));
  };

  const handleGeneratePDFs = async () => {
    console.log("🔥 [CAVEMAN-ULTRA] handleGeneratePDFs button clicked! Preparing to process certificates.", { formData, participantes });
    setShowErrors(true);

    if (!formData.nombre_solicitud || formData.nombre_solicitud.trim() === "") {
      setToast("El nombre del curso/taller es requerido");
      return;
    }

    if (!formData.duracion || formData.duracion.trim() === "") {
      setToast("La duración es requerida");
      return;
    }

    if (!formData.contenido || formData.contenido.length === 0) {
      setToast("Agregue al menos un tema al temario");
      return;
    }

    // Verificar si hay campos vacíos obligatorios en algún participante
    const hasIncomplete = participantes.some(
      (p) =>
        !p.name || p.name.trim() === "" || !p.cedula || p.cedula.trim() === "",
    );

    if (hasIncomplete) {
      setToast("Complete el Nombre y la Cédula de todos los participantes");
      return;
    }

    const participantesValidos = participantes.filter(
      (p) =>
        p.name && p.name.trim() !== "" && p.cedula && p.cedula.trim() !== "",
    );
    if (participantesValidos.length === 0) {
      setToast("Agregue al menos un participante con nombre y cédula");
      return;
    }

    // Si la validación es correcta, quitar sombreado de errores
    setShowErrors(false);

    setLoading(true);
    setDownloadProgress({
      current: 0,
      total: participantesValidos.length,
      name: "Generando códigos QR...",
    });

    try {
      const participantesConQR = await Promise.all(
        participantesValidos.map(async (p) => {
          console.log("🔥 [CAVEMAN-ULTRA] Generating JWT token and QR for participant:", p.name, "Cedula:", p.cedula);
          const uniqueId = `CERT-${p.cedula}-${Date.now()}`;
          const secret = new TextEncoder().encode(
            import.meta.env.VITE_CERT_SECRET,
          );
          const token = await new SignJWT({
            id: uniqueId,
            nombre: p.name,
            nombre_curso_taller: formData.nombre_solicitud,
            cedula: p.cedula,
            duracion: formData.duracion,
            tipo_solicitud: formData.tipo_solicitud,
            modalidad: formData.modalidad,
            rol: p.rol,
            contenido: formData.contenido,
            fecha: new Date().toISOString(),
          })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .sign(secret);
          const qrDataUrl = await generateQRCodeDataUrl(token);
          return { ...p, qr: qrDataUrl, codigo: uniqueId, token };
        }),
      );

      if (downloadExcelAlso) {
        exportToExcel(participantesConQR);
      }

      await generatePDFsForParticipants(
        { ...formData, participante: participantesConQR },
        (current, total, name) => {
          setDownloadProgress({ current, total, name });
        },
      );
    } catch (error) {
      console.error("Error generating certificates:", error);
      setToast("Ocurrió un error al generar los certificados");
    } finally {
      setDownloadProgress(null);
      setLoading(false);
    }
  };

  const exportToExcel = (participantesConDatos) => {
    console.log("🔥 [CAVEMAN-ULTRA] exportToExcel called. Processing dataset size:", participantesConDatos.length);
    try {
      const wb = XLSX.utils.book_new();

      // Formatear todo en un solo arreglo de arreglos (AOA)
      const data = [
        ["CONFIGURACIÓN DEL EVENTO", ""],
        ["", ""],
        ["Nombre del Evento", formData.nombre_solicitud || ""],
        ["Tipo de Evento", formData.tipo_solicitud || ""],
        ["Modalidad", formData.modalidad || ""],
        ["Duración", formData.duracion || ""],
        ["Instalaciones", formData.instalaciones || ""],
        ["Fecha Inicial", formData.fecha_inicial || ""],
        ["Fecha de Emisión", formData.dia_emision || ""],
        ["", ""],
        ["TEMARIO / CONTENIDO", ""],
      ];

      // Agregar temario
      if (formData.contenido && formData.contenido.length > 0) {
        formData.contenido.forEach((tema, idx) => {
          data.push([`Tema ${idx + 1}`, tema]);
        });
      } else {
        data.push(["No especificado", ""]);
      }

      data.push(["", ""]);
      data.push(["LISTA DE PARTICIPANTES", ""]);
      data.push(["", ""]);
      data.push(["Nombre Completo", "Cédula", "Rol", "Libro", "Folio", "Renglón", "Código de Verificación"]);

      // Agregar participantes
      participantesConDatos.forEach((p) => {
        data.push([
          p.name,
          p.cedula,
          p.rol || "participante",
          p.libro || "",
          p.folio || "",
          p.reglon || "",
          p.codigo || "No generado",
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Planilla");

      const fileName = `planilla_participantes_${(formData.nombre_solicitud || "evento").replace(/\s+/g, "_")}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      setToast("Error al exportar la planilla en Excel");
    }
  };

  const handleDownloadExcelOnly = () => {
    console.log("🔥 [CAVEMAN-ULTRA] handleDownloadExcelOnly button clicked. Form State:", formData);
    setShowErrors(true);

    if (!formData.nombre_solicitud || formData.nombre_solicitud.trim() === "") {
      setToast("El nombre del curso/taller es requerido");
      return;
    }

    if (!formData.duracion || formData.duracion.trim() === "") {
      setToast("La duración es requerida");
      return;
    }

    const participantesValidos = participantes.filter(
      (p) =>
        p.name && p.name.trim() !== "" && p.cedula && p.cedula.trim() !== "",
    );
    if (participantesValidos.length === 0) {
      setToast("Agregue al menos un participante con nombre y cédula");
      return;
    }

    setShowErrors(false);

    // Generar códigos/tokens básicos para el Excel
    const participantesConCodigos = participantesValidos.map((p) => {
      const uniqueId = `CERT-${p.cedula}-${Date.now()}`;
      return { ...p, codigo: uniqueId };
    });

    exportToExcel(participantesConCodigos);
  };

  return (
    <Layout >
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:right-8 sm:left-auto z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {toast}
          </div>
        </div>
      )}
      <div className="py-6 sm:py-8">
        {/* Banner de cabecera a pantalla completa */}
        <div className="mb-8 border-b border-slate-200/60 pb-6">
          <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-800 uppercase flex items-center gap-3">
            <span className="bg-blue-600 w-2.5 h-10 rounded-full inline-block animate-pulse"></span>
            Generar Certificados
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm sm:text-base">
            Complete la información para generar automáticamente los
            certificados para los participantes.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/40">
            <div className="border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/40 space-y-10"
              onSubmit={handleSubmit}
            >
              {/* Sección Información General */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                  <div className="bg-blue-600 rounded-lg w-2 h-6"></div>
                  <h2 className="font-bold text-slate-800 text-xl">
                    Información del Evento
                  </h2>
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="nombre"
                    >
                      Nombre del {formData.tipo_solicitud}
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder={`Ej: ${formData.tipo_solicitud === "taller" ? "Taller de Excel Avanzado" : "Curso de React"}`}
                      value={formData.nombre_solicitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_solicitud: e.target.value,
                        })
                      }
                      className={`px-4 py-2.5 border-2 rounded-xl focus:ring-4 w-full text-slate-900 transition-all outline-none font-semibold ${
                        showErrors &&
                        (!formData.nombre_solicitud ||
                          !formData.nombre_solicitud.trim())
                          ? "bg-rose-50/50 border-rose-500 focus:border-rose-600 focus:ring-rose-500/10 placeholder:text-rose-300"
                          : "bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500/10 placeholder:text-blue-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="tipo_solicitud"
                    >
                      Tipo de evento
                    </label>
                    <select
                      id="tipo_solicitud"
                      value={formData.tipo_solicitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipo_solicitud: e.target.value,
                        })
                      }
                      className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold cursor-pointer"
                    >
                      <option value="taller">Taller</option>
                      <option value="curso">Curso</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="modalidad"
                    >
                      Modalidad
                    </label>
                    <select
                      id="modalidad"
                      value={formData.modalidad}
                      onChange={(e) =>
                        setFormData({ ...formData, modalidad: e.target.value })
                      }
                      className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold cursor-pointer"
                    >
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="semipresencial">Semipresencial</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="duracion"
                    >
                      Duración
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="duracion"
                        type="number"
                        min="1"
                        max="999"
                        placeholder="Valor"
                        value={formData.duracion.split(" ")[0] || ""}
                        onChange={(e) =>
                          handleDuracionChange(
                            e.target.value,
                            formData.duracion.split(" ")[1] || "horas",
                          )
                        }
                        className={`px-4 py-2.5 border-2 rounded-xl focus:ring-4 w-full text-slate-900 transition-all outline-none font-semibold ${
                          showErrors &&
                          (!formData.duracion || !formData.duracion.trim())
                            ? "bg-rose-50/50 border-rose-500 focus:border-rose-600 focus:ring-rose-500/10 placeholder:text-rose-300"
                            : "bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500/10 placeholder:text-blue-300"
                        }`}
                      />
                      <select
                        value={formData.duracion.split(" ")[1] || "horas"}
                        onChange={(e) =>
                          handleDuracionChange(
                            formData.duracion.split(" ")[0] || "",
                            e.target.value,
                          )
                        }
                        className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all outline-none font-semibold cursor-pointer"
                      >
                        <option value="horas">Horas</option>
                        <option value="dias">Días</option>
                        <option value="meses">Meses</option>
                        <option value="años">Años</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="instalaciones"
                    >
                      Instalaciones
                    </label>
                    <input
                      id="instalaciones"
                      type="text"
                      placeholder="Ubicación"
                      value={formData.instalaciones}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instalaciones: e.target.value,
                        })
                      }
                      className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none placeholder:text-blue-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="fecha_inicial"
                    >
                      Fecha Inicial
                    </label>
                    <input
                      id="fecha_inicial"
                      type="date"
                      value={formData.fecha_inicial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_inicial: e.target.value,
                        })
                      }
                      className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-1.5 font-semibold text-slate-700 text-sm"
                      htmlFor="dia_emision"
                    >
                      Fecha de emisión
                    </label>
                    <input
                      id="dia_emision"
                      type="date"
                      value={formData.dia_emision}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dia_emision: e.target.value,
                        })
                      }
                      className="bg-blue-50 px-4 py-2.5 border-2 border-blue-200 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 w-full text-slate-900 transition-all outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Contenido */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                  <div className="bg-amber-500 rounded-lg w-2 h-6"></div>
                  <h2 className="font-bold text-slate-800 text-xl">
                    Temario / Contenido
                  </h2>
                </div>
                <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                  <InputArray
                    onTagsChange={(newTags) =>
                      setFormData({ ...formData, contenido: newTags })
                    }
                    label="temas"
                    tagsDefault={formData.contenido}
                    hasError={
                      showErrors &&
                      (!formData.contenido || formData.contenido.length === 0)
                    }
                  />
                </div>
              </div>

              {/* Sección Participantes */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-slate-200 border-b pb-2">
                  <div className="bg-emerald-500 rounded-lg w-2 h-6"></div>
                  <h2 className="font-bold text-slate-800 text-xl">
                    Participantes
                  </h2>
                </div>
                <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                  <PaticipantesSection
                    participantes={participantes}
                    setParticipantes={setParticipantes}
                    showErrors={showErrors}
                  />
                </div>
              </div>

              {/* Footer del Formulario */}
              <div className="pt-8 w-full space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <input
                    id="download-excel-toggle"
                    type="checkbox"
                    checked={downloadExcelAlso}
                    onChange={(e) => setDownloadExcelAlso(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="download-excel-toggle" className="text-slate-700 text-sm font-semibold cursor-pointer select-none">
                    Descargar planilla en Excel al generar PDFs
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGeneratePDFs}
                    className="group relative flex justify-center items-center bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-bold text-white text-base sm:text-lg transition-all transform active:scale-[0.98] overflow-hidden shadow-lg shadow-blue-500/30"
                  >
                    <div className="top-0 left-0 absolute bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center gap-2">
                      Descargar PDFs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadExcelOnly}
                    className="group relative flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 px-6 py-4 rounded-2xl font-bold text-white text-base sm:text-lg transition-all transform active:scale-[0.98] overflow-hidden shadow-lg shadow-emerald-500/30"
                  >
                    <div className="top-0 left-0 absolute bg-gradient-to-r from-white/0 via-white/10 to-white/0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center gap-2">
                      Descargar Excel
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-center text-slate-400 text-xs">
                  Se generará un archivo PDF individual con código QR verificado para cada participante, y/o la planilla consolidada en Excel.
                </p>
              </div>
            </form>

            <div className="lg:col-span-5 lg:sticky lg:top-20 w-full">
              <PreviewCertificate
                formData={formData}
                participantes={participantes}
              />
            </div>
          </div>
        )}
      </div>
      {downloadProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/90 border border-slate-200/50 shadow-2xl p-6 sm:p-8 rounded-3xl max-w-md w-full text-center transition-all scale-in duration-300">
            {/* Spinning Loader / Icon */}
            <div className="relative flex justify-center items-center mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-blue-600 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>

            {/* Title & Status */}
            <h3 className="font-extrabold text-slate-800 text-xl tracking-tight uppercase">
              Generando Certificados
            </h3>
            <p className="mt-2 text-slate-500 text-xs">
              Procesando y descargando de forma controlada para proteger tu PC.
            </p>

            {/* Progress bar */}
            {downloadProgress.total > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2 text-slate-600 text-[10px] font-bold uppercase">
                  <span>Progreso de descargas</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {downloadProgress.current} / {downloadProgress.total}
                  </span>
                </div>
                <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${(downloadProgress.current / downloadProgress.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Participant Name */}
            <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                Participante Actual
              </span>
              <span className="font-bold text-slate-700 text-sm sm:text-base block truncate">
                {downloadProgress.name || "Preparando..."}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold leading-relaxed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              No cierres esta pestaña durante el proceso.
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
