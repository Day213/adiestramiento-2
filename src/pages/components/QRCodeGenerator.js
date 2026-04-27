import QRCode from "qrcode";

export const generateQRCodeDataUrl = async (token) => {
  try {
    const baseUrl = import.meta.env.VITE_URL || window.location.origin;
    const url = `${baseUrl}validar?token=${token}`;
    return await QRCode.toDataURL(url);
  } catch (err) {
    console.error("Error generating QR:", err);
    return null;
  }
};
