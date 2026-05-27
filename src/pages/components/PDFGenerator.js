import jsPDF, { GState } from "jspdf";
import mebreteImage from "/mebrete.png";
import NataliFirma from "/natalifirma.png";
import JoseFirma from "/jose.png";
import footer from "/footer.jpg";
import background from "/background.png";
import eydisFirma from "/eydis-martinez.png";
import franciscoMiranda from "/francisco-miranda.png";
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

export const generatePDFsForParticipants = async (formData, onProgress) => {
  console.log("generatePDFsForParticipants called with formData:", formData);

  if (!formData.participante || formData.participante.length === 0) {
    console.error("No participants found in formData.");
    return;
  }

  for (let index = 0; index < formData.participante.length; index++) {
    const participant = formData.participante[index];
    console.log(`Generating PDF for participant: ${participant.name}`);

    if (onProgress) {
      onProgress(index + 1, formData.participante.length, participant.name);
    }

    // Esperar 800ms para mantener el navegador responsivo y no colapsar la PC
    await new Promise((resolve) => setTimeout(resolve, 800));

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

    // Agregar marca de agua (Francisco de Miranda)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = 250; // Ajustar tamaño según sea necesario
    const imgHeight = 150;

    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity: 0.15 })); // Muy baja opacidad
    doc.addImage(
      franciscoMiranda,
      "JPEG",
      (pageWidth - imgWidth) / 350, // Centrado horizontalmente
      (pageHeight - imgHeight) / 2, // Centrado verticalmente
      imgWidth,
      imgHeight
    );
    doc.restoreGraphicsState();

    // Agrega la imagen 'mebreteImage' al PDF.
    // Los números representan:
    // 10: posición X (horizontal) desde la izquierda
    // 10: posición Y (vertical) desde arriba
    // 180: ancho de la imagen en el PDF
    // 25: alto de la imagen en el PDF
    doc.addImage(mebreteImage, "JPEG", 20, 1, 200, 30);

    doc.setFontSize(17);

    const formattedDate = parseLocalDate(formData.fecha_inicial).toLocaleString(
      "es-ES",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    doc.setFont(undefined, "normal");
    doc.setLineHeightFactor(1.5); // Establece un interlineado mayor
    const content = `Universidad Nacional Experimental Francisco de Miranda\nVicerrectorado Administrativo - Dirección de Recursos Humanos\nDepartamento de Adiestramiento`;
    doc.text(content, 140, 50, { align: "center", maxWidth: 180 });
    doc.setFont(undefined, "bold");
    doc.text("Otorga el presente certificado a:", 140, 80, { align: "center" });

    doc.setFont(undefined, "bolditalic");
    doc.text(participant.name, 140, 95, { align: "center" });

    doc.setFont(undefined, "bolditalic");
    doc.text(`C.I: ${participant.cedula}`, 140, 105, { align: "center" });

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
      `En calidad de ${(formData.rol || 'participante').toUpperCase()} en el ${formData.tipo_solicitud.toUpperCase()}: ${formData.nombre_solicitud
      } (MODALIDAD ${formData.modalidad.toUpperCase()}). Evento realizado en ${formData.instalaciones
      } el día ${parseLocalDate(formData.dia_emision).toLocaleString("es-ES", {
        day: "2-digit",
      })} de ${parseLocalDate(formData.dia_emision).toLocaleString("es-ES", {
        month: "long",
      })} de ${parseLocalDate(formData.dia_emision).getFullYear()}. Duración: ${formData.duracion
      }`,
      20,
      120,
      { align: "left", maxWidth: 250 }
    );

    doc.setFont(undefined, "normal");
    doc.addImage(JoseFirma, "PNG", 125, 130, 45, 25);
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
    doc.addImage(NataliFirma, "PNG", 215, 130, 45, 25);
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
    doc.addImage(eydisFirma, "JPEG", 30, 155 - 20, 40, 20);
    doc.text("_________________________", 20, 171 - 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Ing. Eydis Martinez", 30, 178 - 20);

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

    // Agregar el QR y enlace en la parte superior derecha de la segunda página
    if (participant.qr) {
      let baseUrl = import.meta.env.VITE_URL || "https://adiestramiento.netlify.app";
      if (!baseUrl.endsWith('/')) baseUrl += '/';
      const verificationUrl = `${baseUrl}validar?token=${participant.token}`;

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0, 100, 200);
      doc.textWithLink('Verificar documento aquí', 20, 15, { url: verificationUrl });
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text(`Token: ${participant.token}`, 20, 25, { maxWidth: 180 });

      doc.addImage(participant.qr, "PNG", 225, 10, 50, 50);
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
  }
};

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
