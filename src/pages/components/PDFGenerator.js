import jsPDF, { GState } from "jspdf";
import mebreteImage from "/mebrete.png";
import americaFirma from "/america.png";
import NataliFirma from "/jose.png";
import kikiFirma from "/kiki.png";
import footer from "/footer.jpg";
import logo_unefm from "/logo_unefm.png";
import emblema from "/emblema.png";
import ministerio from "/ministerio.png";
import background from "/background.png";

export const generatePDFsForParticipants = (formData) => {
  console.log("generatePDFsForParticipants called with formData:", formData);

  if (!formData.participante || formData.participante.length === 0) {
    console.error("No participants found in formData.");
    return;
  }

  formData.participante.forEach((participant, index) => {
    console.log(`Generating PDF for participant: ${participant.name}`);

    const doc = new jsPDF({ orientation: "l" });

    // Agregar la imagen de fondo solo a la primera página
    doc.addImage(
      background,
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    );

    // Agrega la imagen 'mebreteImage' al PDF.
    // Los números representan:
    // 10: posición X (horizontal) desde la izquierda
    // 10: posición Y (vertical) desde arriba
    // 180: ancho de la imagen en el PDF
    // 25: alto de la imagen en el PDF
    doc.addImage(mebreteImage, "JPEG", 20, 1, 200, 30);

    doc.setFontSize(17);

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
    const content = `Universidad Nacional Experimental Francisco de Miranda Vicerrectorado Administrativo Dirección de Recursos Humanos Departamento de Adiestramiento`;
    doc.text(content, 140, 50, { align: "center", maxWidth: 150 });

    doc.setFont(undefined, "bold");
    doc.text("Otorga el presente certificado a:", 140, 80, { align: "center" });

    doc.setFont(undefined, "bolditalic");
    doc.text(participant.name, 140, 95, { align: "center" });

    doc.setFont(undefined, "bolditalic");
    doc.text(`C.I: ${participant.cedula}`, 140, 105, { align: "center" });

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
      `En calidad de PARTICIPANTE en el taller: ${
        formData.nombre_solicitud
      } (MODALIDAD PRESENCIAL). Evento realizado en ${
        formData.instalaciones
      } el día ${new Date(formData.dia_emision).toLocaleString("es-ES", {
        day: "2-digit",
      })} de ${new Date(formData.dia_emision).toLocaleString("es-ES", {
        month: "long",
      })} de ${new Date(formData.dia_emision).getFullYear()}. Duración: ${
        formData.duracion
      }`,
      20,
      120,
      { align: "left", maxWidth: 250 }
    );

    doc.setFont(undefined, "normal");
    doc.addImage(NataliFirma, "PNG", 125, 130, 45, 25);
    doc.text("_______________________", 120, 152);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Licdo. José Ramírez", 128, 158);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Vicerrector Administrativo UNEFM", 148, 162, {
      align: "center",
      maxWidth: 50,
    });

    doc.setFont(undefined, "normal");
    doc.addImage(kikiFirma, "PNG", 220, 130, 45, 25);
    doc.text("_________________________", 216, 152);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Dra. Natali Galicia", 222, 160);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Directora de Recursos Humanos", 240, 165, {
      align: "center",
      maxWidth: 50,
    });

    doc.setFontSize(12);
    doc.addImage(americaFirma, "PNG", 30, 155 - 20, 40, 20);
    doc.text("_________________________", 20, 171 - 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Licda. America Colina", 30, 178 - 20);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      "Jefe del departamento de Adiestramiento y Desarrollo",
      50,
      183 - 20,
      {
        align: "center",
        maxWidth: 50,
      }
    );

    // Agregar una nueva página para los detalles del programa
    doc.addPage();

    // Agregar el QR en la parte superior derecha de la segunda página
    if (participant.qr) {
      doc.addImage(participant.qr, "PNG", 225, 10, 70, 70);
      doc.setFontSize(8);
      doc.saveGraphicsState();
      // Ajustamos la posición del token para que sea visible en la segunda página
      doc.setFont(undefined, "bold");
      doc.text('TOKEN DE VERIFICACIÓN', 20, 15, { align: "left" });
      doc.setFont(undefined, "normal");
      doc.text(participant.token, 20, 20, { align: "left", maxWidth: 200 });
      doc.restoreGraphicsState();
    }

    doc.setFontSize(17);
    doc.setFont(undefined, "bold");
    doc.text("CONTENIDO", 20, 55);

    // Agregar lista con el contenido del programa
    doc.setFontSize(15);
    doc.setFont(undefined, "normal");
    doc.setLineHeightFactor(1.5); // Establece un interlineado mayor
    let y = 65;
    formData.contenido.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 20, y, {
        bullet: {
          type: "circle",
          color: [50, 50, 200],
          offset: 10,
        },
      });
      y += 10;
    });

    // Agregar tabla de registro en la esquina inferior derecha
    const tableX = 190; // Posición X de la tabla
    const tableY = 260 - 70; // Posición Y de la tabla
    const cellWidth = 30;
    const cellHeight = 8;

    // Dibujar encabezados de la tabla
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("N° LIBRO", tableX + 5, tableY - 3);
    doc.text("FOLIO", tableX + cellWidth + 5, tableY - 3);
    doc.text("N° RENGLON", tableX + cellWidth * 2 + 5, tableY - 3);

    // Dibujar celdas con los datos del participante
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);

    // Dibujar celdas
    doc.rect(tableX, tableY, cellWidth, cellHeight);
    doc.rect(tableX + cellWidth, tableY, cellWidth, cellHeight);
    doc.rect(tableX + cellWidth * 2, tableY, cellWidth, cellHeight);

    // Agregar los valores en las celdas
    doc.text(participant.libro || "", tableX + 5, tableY + 6);
    doc.text(participant.folio || "", tableX + cellWidth + 5, tableY + 6);
    doc.text(participant.reglon || "", tableX + cellWidth * 2 + 5, tableY + 6);

    // Agregar el pie de página con logo
    doc.addImage(footer, "JPEG", 20, 275, 180, 18);

    const fileName = `constancia_${capitalizeWords(participant.name).replace(
      /\s+/g,
      "_"
    )}_${index + 1}.pdf`;
    console.log(`Saving PDF with fileName: ${fileName}`);
    doc.save(fileName);
  });
};

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
