import { jsPDF } from "jspdf";

const useGeneratePDF = () => {
  const generatePDF = (callback, fileName = "documento.pdf") => {
    const doc = new jsPDF();

    // Permitir al usuario agregar contenido personalizado al PDF
    if (typeof callback === "function") {
      callback(doc);
    }

    // Descargar el PDF
    doc.save(fileName);
  };

  return { generatePDF };
};

export default useGeneratePDF;
