import QRCode from "qrcode";

export const generateQRCodeDataUrl = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (err) {
    console.error("Error generating QR:", err);
    return null;
  }
};
