
import React from 'react';
import { MapData, CellState } from '../types';

interface HotspotMapProps {
  mapData: MapData;
}

const getCellColor = (cell: CellState): string => {
  if (cell.population === 0) return 'bg-gray-600'; // No population
  const infectionRatio = cell.infected / cell.population;

  if (infectionRatio === 0 && cell.exposed === 0) return 'bg-green-700 hover:bg-green-600'; // Healthy
  if (infectionRatio === 0 && cell.exposed > 0) return 'bg-yellow-600 hover:bg-yellow-500'; // Exposed, no active infection
  
  if (infectionRatio > 0.15) return 'bg-red-800 hover:bg-red-700'; // Very High
  if (infectionRatio > 0.10) return 'bg-red-700 hover:bg-red-600'; // High
  if (infectionRatio > 0.05) return 'bg-red-600 hover:bg-red-500'; // Medium-High
  if (infectionRatio > 0.01) return 'bg-orange-600 hover:bg-orange-500'; // Medium
  if (infectionRatio > 0) return 'bg-yellow-700 hover:bg-yellow-600'; // Low
  
  return 'bg-green-700 hover:bg-green-600'; // Default healthy
};

const HotspotMap: React.FC<HotspotMapProps> = ({ mapData }) => {
  if (!mapData || mapData.length === 0) {
    return <div className="p-6 bg-gray-800 rounded-xl shadow-2xl text-center text-gray-400">Map data not available.</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-sky-400 border-b-2 border-sky-500 pb-2">Pandemic Hotspot Map</h3>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${mapData[0]?.length || 1}, minmax(0, 1fr))` }}>
        {mapData.map((row, rowIndex) =>
          row.map((cell) => (
            <div
              key={cell.id}
              className={`aspect-square ${getCellColor(cell)} transition-colors duration-200 ease-in-out flex items-center justify-center text-white text-xs relative group`}
              title={`Cell (${cell.row},${cell.col})\nPop: ${cell.population.toLocaleString()}\nInf: ${cell.infected.toLocaleString()} (${((cell.infected/cell.population)*100).toFixed(1)}%)\nExp: ${cell.exposed.toLocaleString()}`}
            >
              {/* Optional: Display small text like infection % if space permits */}
              {/* <span className="hidden group-hover:block p-1 bg-black/50 rounded text-xxs absolute top-0 left-0">{`${((cell.infected/cell.population)*100).toFixed(0)}%`}</span> */}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 items-center justify-center text-xs">
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-green-700"></div> Healthy/Recovered</span>
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-yellow-700"></div> Low Infection</span>
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-yellow-600"></div> Exposed Only</span>
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-orange-600"></div> Medium Infection</span>
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-red-600"></div> Med-High Infection</span>
        <span className="flex items-center"><div className="w-3 h-3 mr-1 bg-red-800"></div> Very High Infection</span>
      </div>
    </div>
  );
};

export default HotspotMap;
