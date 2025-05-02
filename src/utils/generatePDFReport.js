import useGeneratePDF from "../Hook/useGeneratePdf";


const { generatePDF} = useGeneratePDF();

const generateName = () => {
    const date = new Date();
    return `CheckCars-Resumen-${date.toISOString().split("T")[0]}.pdf`;
  };

export default function generatePDFReport(entry, data) {
    // Generar el PDF
    generatePDF((doc) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;
  
        // Portada
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("CheckCars", pageWidth / 2, y, { align: "center" });
        y += 10;
        doc.setFontSize(16);
        doc.text("Resumen de Salida de Vehículo", pageWidth / 2, y, {
          align: "center",
        });
        y += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, pageWidth / 2, y, {
          align: "center",
        });
  
        doc.addPage();
  
        const drawSectionTitle = (title) => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(30, 30, 30);
          doc.text(title, 10, y);
          y += 6;
          doc.setDrawColor(200);
          doc.line(10, y, pageWidth - 10, y);
          y += 10;
        };
  
        const drawField = (label, value) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          const text = `${label}: ${value || "—"}`;
          const lines = doc.splitTextToSize(text, pageWidth - 20);
          lines.forEach((line) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, 12, y);
            y += 6;
          });
        };
  
        // Sección: Información general
        drawSectionTitle("1. Información del Vehículo");
        drawField("Autor", entry.author);
        drawField("Fecha de creación", new Date(entry.created).toLocaleString("es-ES"));
        drawField("Placa", entry.carPlate);
        drawField("Kilometraje", entry.mileage);
        drawField("Estado de pintura", entry.paintState);
        drawField("Estado mecánico", entry.mecanicState);
        drawField("Nivel de aceite", entry.oilLevel);
        drawField("Estado interiores", entry.interiorsState);
        drawField("Motivo / Observaciones", entry.notes);
  
        // Sección: Condiciones
        drawSectionTitle("2. Condiciones y Accesorios");
        drawField("Estado neumáticos", entry.tiresState);
        drawField("Nivel de combustible", `${entry.fuelLevel}%`);
        drawField("Llanta de repuesto", entry.hasSpareTire ? "Sí" : "No");
        drawField("Cargador USB", entry.hasChargerUSB ? "Sí" : "No");
        drawField("Quick Pass", entry.hasQuickPass ? "Sí" : "No");
        drawField("Soporte telefónico", entry.hasPhoneSupport ? "Sí" : "No");
        drawField("Kit de emergencia", entry.hasEmergencyKit ? "Sí" : "No");
  
        // Sección: Ubicación GPS
        drawSectionTitle("3. Ubicación GPS");
        drawField("Latitud", entry.latitude);
        drawField("Longitud", entry.longitude);
  
        // Sección: Imágenes
        if (data && data.length > 0) {
          drawSectionTitle("4. Galería de Fotos");
  
          const imagePromises = data.map((photo) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = photo.filePath;
  
              img.onload = () => {
                const imgW = 80;
                const imgH = (img.height * imgW) / img.width;
  
                if (y + imgH > 270) {
                  doc.addPage();
                  y = 20;
                }
  
                doc.addImage(img, "JPEG", 10, y, imgW, imgH);
                y += imgH + 10;
                resolve();
              };
  
              img.onerror = () => {
                console.warn(`No se pudo cargar la imagen: ${photo.filePath}`);
                resolve();
              };
            });
          });
  
          Promise.all(imagePromises).then(() => {
            doc.save();
          });
        } else {
          doc.save();
        }
      }, generateName());
}

