import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

const ledModels = {
  "CRYSTAL 1.9MM": { pixelDensity: 256, powerPerCabinet: 150, weightPerCabinet: 8, cabinetSize: [500, 500] },
  "Spider 2.6MM": { pixelDensity: 192, powerPerCabinet: 140, weightPerCabinet: 7.5, cabinetSize: [500, 500] },
  "HB2 2.9MM": { pixelDensity: 168, powerPerCabinet: 130, weightPerCabinet: 7, cabinetSize: [500, 500] },
  "BM 3.9MM": { pixelDensity: 128, powerPerCabinet: 120, weightPerCabinet: 6.5, cabinetSize: [500, 500] },
  "PL 4.8MM": { pixelDensity: 104, powerPerCabinet: 110, weightPerCabinet: 6, cabinetSize: [500, 500] },
  "CL 2.9MM (Curved)": { pixelDensity: 168, powerPerCabinet: 130, weightPerCabinet: 7, isCurved: true, cabinetSize: [500, 500] },
  "CL 3.9MM (Curved)": { pixelDensity: 128, powerPerCabinet: 120, weightPerCabinet: 6.5, isCurved: true, cabinetSize: [500, 500] },
  "LED Standee 2.5MM": { pixelDensity: 256, width: 640, height: 1920, powerPerCabinet: 600, weightPerCabinet: 50, cabinetSize: [640, 1920] },
};

const unitConversion = { meters: 1, mm: 0.001, inches: 0.0254, feet: 0.3048 };

const calculateCircleCabinets = (diameter, degree, cabinetSize) => {
  const circumference = Math.PI * diameter;
  const arcLength = (circumference * degree) / 360;
  return Math.ceil(arcLength / (cabinetSize[0] / 1000));
};

export default function LEDCalculator() {
  const [model, setModel] = useState("CRYSTAL 1.9MM");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [unit, setUnit] = useState("meters");
  const [diameter, setDiameter] = useState(1);
  const [degree, setDegree] = useState(360);
  const canvasRef = useRef(null);

  const convertSize = (value) => value * unitConversion[unit];

  const calculateValues = () => {
    const { pixelDensity, powerPerCabinet, weightPerCabinet, cabinetSize } = ledModels[model];
    const convertedWidth = convertSize(width);
    const convertedHeight = convertSize(height);
    const totalWidthPixels = Math.round((convertedWidth / (cabinetSize[0] / 1000)) * pixelDensity);
    const totalHeightPixels = Math.round((convertedHeight / (cabinetSize[1] / 1000)) * pixelDensity);
    const totalCabinets = Math.ceil((convertedWidth / (cabinetSize[0] / 1000)) * (convertedHeight / (cabinetSize[1] / 1000)));
    const totalPower = totalCabinets * powerPerCabinet;
    const totalWeight = totalCabinets * weightPerCabinet;
    const circleCabinets = calculateCircleCabinets(diameter, degree, cabinetSize);
    return { totalWidthPixels, totalHeightPixels, totalPower, totalWeight, totalCabinets, circleCabinets };
  };

  const { totalWidthPixels, totalHeightPixels, totalPower, totalWeight, totalCabinets, circleCabinets } = calculateValues();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Shivam Video LED Calculator Report", 10, 10);
    doc.text(`Model: ${model}`, 10, 20);
    doc.text(`Total Width Pixels: ${totalWidthPixels}px`, 10, 30);
    doc.text(`Total Height Pixels: ${totalHeightPixels}px`, 10, 40);
    doc.text(`Total Cabinets: ${totalCabinets}`, 10, 50);
    doc.text(`Total Power: ${totalPower}W`, 10, 60);
    doc.text(`Total Weight: ${totalWeight}kg`, 10, 70);
    doc.text(`Circle Cabinets Required: ${circleCabinets}`, 10, 80);
    doc.save("LED_Calculator_Report.pdf");
  };

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Shivam Video LED Calculator</h1>
      <canvas ref={canvasRef} width={400} height={200} className="bg-white"></canvas>
      <button onClick={generatePDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Download Report</button>
    </div>
  );
}
