import { useState } from "react";

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

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-xl max-w-4xl mx-auto">
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
          <label>Width ({unit})</label>
          <input type="number" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 1)} />
        </div>
        <div>
          <label>Height ({unit})</label>
          <input type="number" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 1)} />
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
        <div>
          <label>Circle Diameter ({unit})</label>
          <input type="number" value={diameter} onChange={(e) => setDiameter(parseFloat(e.target.value) || 1)} />
        </div>
        <div>
          <label>Circle Angle (Degrees)</label>
          <input type="number" value={degree} onChange={(e) => setDegree(parseFloat(e.target.value) || 360)} />
        </div>
      </div>

      <div className="mt-6 bg-gray-800 text-white p-4 rounded-md">
        <h2 className="text-xl font-semibold">Results</h2>
        <p>Total Width Pixels: {totalWidthPixels}px</p>
        <p>Total Height Pixels: {totalHeightPixels}px</p>
        <p>Total Cabinets: {totalCabinets}</p>
        <p>Total Power: {totalPower}W</p>
        <p>Total Weight: {totalWeight}kg</p>
        <p>Circle Cabinets Required: {circleCabinets}</p>
      </div>
    </div>
  );
}
