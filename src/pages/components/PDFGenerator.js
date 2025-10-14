import jsPDF from "jspdf";
import mebreteImage from "/mebrete.jpg"; // Asegúrate de que la ruta sea correcta

export const generatePDFsForParticipants = (formData) => {
  console.log("generatePDFsForParticipants called with formData:", formData);

  if (!formData.participante || formData.participante.length === 0) {
    console.error("No participants found in formData.");
    return;
  }

  formData.participante.forEach((participant, index) => {
    console.log(`Generating PDF for participant: ${participant.name}`);

    const doc = new jsPDF();

    doc.addImage(mebreteImage, "JPEG", 10, 10, 150, 25);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("CONSTANCIA", 105, 60, { align: "center" });

    const formattedDate = new Date(formData.fecha_inicial).toLocaleString(
      "es-ES",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    doc.setFont(undefined, "normal");
    doc.setLineHeightFactor(1.5); // Establece un interlineado mayor
    const content = `Por medio de la presente se certifica que el Ciudadano (a): ${participant.name}, Titular de la Cedula de Identidad N°: ${participant.cedula}, En calidad de PARTICIPANTE ha culminado exitosamente el TALLER: ${formData.nombre_solicitud} con una duración de ${formData.duracion} y celebrado de la fecha inicial ${formattedDate} realizado en ${formData.instalaciones}.`;
    doc.text(content, 20, 70, { align: "left", maxWidth: 170 });

    doc.text(
      `
      \n\nConstancia que se emite a los ${
        formData.dia_emision.split("-")[2]
      } días del mes de ${new Date(formData.dia_emision).toLocaleString(
        "es-ES",
        {
          month: "long",
        }
      )} de ${formData.dia_emision.split("-")[0]}.`,
      105,
      100,
      { align: "center" }
    );

    doc.setFont(undefined, "normal");
    doc.text("_________________________", 20, 160);
    doc.text("Licda. Erika Galanos", 20, 165);
    doc.text("Directora de Recursos Humanos", 20, 170);

    doc.text("_________________________", 120, 160);
    doc.text("Licdo. José Ramírez", 120, 165);
    doc.text("Vicerrector Administrativo UNEFM", 120, 170);

    doc.text("_________________________", 70, 210);
    doc.text("Licda. America Colina", 79, 215);
    doc.text("Jefe del departamento de Adiestramiento y Desarrollo", 50, 220);

    const fileName = `constancia_${participant.name.replace(/\s+/g, "_")}_${
      index + 1
    }.pdf`;
    console.log(`Saving PDF with fileName: ${fileName}`);
    doc.save(fileName);
  });
};
