import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const models = [
  { name: "CRYSTAL 1.9MM", pixelPitch: 1.9, pixelsPerCabinet: 256, powerPerCabinet: 150, weightPerCabinet: 8 },
  { name: "Spider 2.6MM", pixelPitch: 2.6, pixelsPerCabinet: 192, powerPerCabinet: 140, weightPerCabinet: 7.5 },
  { name: "HB2 2.9MM", pixelPitch: 2.9, pixelsPerCabinet: 168, powerPerCabinet: 130, weightPerCabinet: 7 },
  { name: "BM 3.9MM", pixelPitch: 3.9, pixelsPerCabinet: 128, powerPerCabinet: 120, weightPerCabinet: 6.5 },
  { name: "PL 4.8MM", pixelPitch: 4.8, pixelsPerCabinet: 104, powerPerCabinet: 110, weightPerCabinet: 6 },
  { name: "CL 2.9MM (Curved)", pixelPitch: 2.9, pixelsPerCabinet: 168, powerPerCabinet: 130, weightPerCabinet: 7, curved: true, maxCurveAngle: 80 },
  { name: "CL 3.9MM (Curved)", pixelPitch: 3.9, pixelsPerCabinet: 128, powerPerCabinet: 120, weightPerCabinet: 6.5, curved: true, maxCurveAngle: 80 },
];

export default function LEDCalculator() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [curveAngle, setCurveAngle] = useState(0);
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const totalPixelsWidth = width * selectedModel.pixelsPerCabinet;
  const totalPixelsHeight = height * selectedModel.pixelsPerCabinet;
  const aspectRatio = `${totalPixelsWidth}:${totalPixelsHeight}`;
  const totalCabinets = width * height;
  const totalPower = totalCabinets * selectedModel.powerPerCabinet;
  const totalWeight = totalCabinets * selectedModel.weightPerCabinet;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("LED Wall Calculation Report - Shivam Video", 10, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Parameter", "Value"]],
      body: [
        ["Model", selectedModel.name],
        ["Total Pixels (Width)", totalPixelsWidth],
        ["Total Pixels (Height)", totalPixelsHeight],
        ["Aspect Ratio", aspectRatio],
        ["Total Cabinets", totalCabinets],
        ["Total Power Consumption (W)", totalPower],
        ["Total Weight (kg)", totalWeight],
        selectedModel.curved ? ["Curved Angle (°)", curveAngle] : null,
      ].filter(Boolean),
    });
    doc.save("LED_Wall_Report.pdf");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">LED Wall Calculator - Shivam Video</h1>

      <select onChange={(e) => setSelectedModel(models.find(m => m.name === e.target.value))}>
        {models.map((model) => (
          <option key={model.name} value={model.name}>{model.name}</option>
        ))}
      </select>

      <div className="flex space-x-4 mt-4">
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} placeholder="Width (Cabinets)" />
        <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} placeholder="Height (Cabinets)" />
      </div>

      {selectedModel.curved && (
        <div className="mt-4">
          <input type="number" value={curveAngle} onChange={(e) => setCurveAngle(Number(e.target.value))} placeholder="Curve Angle (°)" />
          <p>Max Curve Angle: {selectedModel.maxCurveAngle}°</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <p><strong>Total Pixels (Width):</strong> {totalPixelsWidth}px</p>
        <p><strong>Total Pixels (Height):</strong> {totalPixelsHeight}px</p>
        <p><strong>Aspect Ratio:</strong> {aspectRatio}</p>
        <p><strong>Total Cabinets:</strong> {totalCabinets}</p>
        <p><strong>Total Power Consumption:</strong> {totalPower}W</p>
        <p><strong>Total Weight:</strong> {totalWeight}kg</p>
      </div>

      <button onClick={generatePDF}>Export PDF</button>
    </div>
  );
}
