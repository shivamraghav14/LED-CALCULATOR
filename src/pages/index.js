import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import ShivamLogo from "../public/shivam_logo.jpeg";

const ledModels = {
  "CRYSTAL 1.9MM": { pixelDensity: 256, powerPerCabinet: 150, weightPerCabinet: 8 },
  "Spider 2.6MM": { pixelDensity: 192, powerPerCabinet: 140, weightPerCabinet: 7.5 },
  "HB2 2.9MM": { pixelDensity: 168, powerPerCabinet: 130, weightPerCabinet: 7 },
  "BM 3.9MM": { pixelDensity: 128, powerPerCabinet: 120, weightPerCabinet: 6.5 },
  "PL 4.8MM": { pixelDensity: 104, powerPerCabinet: 110, weightPerCabinet: 6 },
  "CL 2.9MM (Curved)": { pixelDensity: 168, powerPerCabinet: 130, weightPerCabinet: 7, isCurved: true },
  "CL 3.9MM (Curved)": { pixelDensity: 128, powerPerCabinet: 120, weightPerCabinet: 6.5, isCurved: true },
  "LED Standee 2.5MM": { pixelDensity: 256, width: 640, height: 1920, powerPerCabinet: 600, weightPerCabinet: 50 },
};

const unitConversion = { meters: 1, mm: 0.001, inches: 0.0254, feet: 0.3048 };

const getAspectRatio = (width, height) => {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

export default function LEDCalculator() {
  const [model, setModel] = useState("CRYSTAL 1.9MM");
  const [width, setWidth] = useState(2000);
  const [height, setHeight] = useState(1000);
  const [unit, setUnit] = useState("mm");

  const convertSize = (value) => value * unitConversion[unit];

  const calculateValues = () => {
    const { pixelDensity, powerPerCabinet, weightPerCabinet } = ledModels[model];
    const convertedWidth = convertSize(width);
    const convertedHeight = convertSize(height);
    const totalWidthPixels = Math.round((convertedWidth / 0.5) * pixelDensity);
    const totalHeightPixels = Math.round((convertedHeight / 0.5) * pixelDensity);
    const aspectRatio = getAspectRatio(totalWidthPixels, totalHeightPixels);
    const totalCabinets = Math.ceil((convertedWidth / 0.5) * (convertedHeight / 0.5));
    const totalPower = totalCabinets * powerPerCabinet;
    const totalWeight = totalCabinets * weightPerCabinet;
    return { totalWidthPixels, totalHeightPixels, aspectRatio, totalPower, totalWeight, totalCabinets };
  };

  const { totalWidthPixels, totalHeightPixels, aspectRatio, totalPower, totalWeight, totalCabinets } = calculateValues();

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <Image src={ShivamLogo} alt="Shivam Video Logo" className="mx-auto mb-4 w-40" />
      <h1 className="text-3xl font-bold mb-6 text-center">Shivam Video LED Calculator</h1>
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
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="meters">Meters</option>
            <option value="mm">Millimeters</option>
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 text-white p-4 rounded-md">
        <h2 className="text-xl font-semibold">Results</h2>
        <p>Total Width Pixels: {totalWidthPixels}px</p>
        <p>Total Height Pixels: {totalHeightPixels}px</p>
        <p>Aspect Ratio: {aspectRatio}</p>
        <p>Total Cabinets: {totalCabinets}</p>
        <p>Total Power: {totalPower}W</p>
        <p>Total Weight: {totalWeight}kg</p>
      </div>

      <p className="mt-6 text-sm text-center opacity-70">© 2025 Shivam Video Pvt. Ltd. - Proprietary & Confidential</p>
    </div>
  );
}
