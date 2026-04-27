import QRCode from "qrcode";

export const generateQRCodeDataUrl = async (token) => {
  try {
    let baseUrl = import.meta.env.VITE_URL || window.location.origin;
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    const url = `${baseUrl}validar?token=${token}`;
    return await QRCode.toDataURL(url);
  } catch (err) {
    console.error("Error generating QR:", err);
    return null;
  }
};
