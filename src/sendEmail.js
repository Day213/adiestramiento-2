import emailjs from "@emailjs/browser";

export async function sendEmailSolicitud({ to_email, subject, message }) {
  return emailjs.send(
    "service_pme297l",
    "template_2rto3c5",
    {
      correo: to_email,
      title: subject,
      message,
      name: "Departamento de adiestramiento y selección",
      time: subject,
    },
    "Yg8bKBL0r2ENXrQ3Y"
  );
}
