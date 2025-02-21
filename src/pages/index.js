import { useState, useEffect, useRef } from "react";
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
  const [design, setDesign] = useState("Flat Wall");
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [unit, setUnit] = useState("meters");
  const [diameter, setDiameter] = useState(1);
  const [degree, setDegree] = useState(360);
  const [curveAngleState, setCurveAngleState] = useState(0);
  const pixelCanvasRef = useRef(null);

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
    const aspectRatio = (convertedWidth / convertedHeight).toFixed(2);
    return { totalWidthPixels, totalHeightPixels, totalPower, totalWeight, totalCabinets, circleCabinets, curveAngle: curveAngleState, aspectRatio };
  };

  const { totalWidthPixels, totalHeightPixels, totalPower, totalWeight, totalCabinets, circleCabinets, curveAngle, aspectRatio } = calculateValues();

  useEffect(() => {
    const canvas = pixelCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(50, 50, totalWidthPixels / 10, totalHeightPixels / 10);
  }, [totalWidthPixels, totalHeightPixels]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-lg shadow-xl max-w-4xl mx-auto border border-gray-600">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">Shivam Video LED Calculator</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>LED Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {Object.keys(ledModels).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Width ({unit})</label>
          <input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} />
        </div>
        <div>
          <label>Height ({unit})</label>
          <input type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} />
        </div>
      </div>
      <div className="mt-6 p-4 bg-black rounded-lg text-center text-yellow-400 border border-yellow-500">
        <h2 className="text-2xl font-bold">Calculated Values</h2>
        <p>Total Width Pixels: {totalWidthPixels}px</p>
        <p>Total Height Pixels: {totalHeightPixels}px</p>
        <p>Total Cabinets: {totalCabinets}</p>
        <p>Total Power: {totalPower}W</p>
        <p>Total Weight: {totalWeight}kg</p>
        <p>Circle Cabinets Required: {circleCabinets}</p>
        <p>Aspect Ratio: {aspectRatio}</p>
      </div>
      <div className="mt-6 p-4 bg-black rounded-lg text-center text-yellow-400 border border-yellow-500">
        <h2 className="text-2xl font-bold">Pixel Map Visualization</h2>
        <canvas ref={pixelCanvasRef} width={500} height={250} className="bg-white"></canvas>
      </div>
      <button className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded shadow-lg">Download Report</button>
    </div>
  );
}
