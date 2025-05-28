
import React from 'react';
import { SimulationState } from '../types';
import { TOTAL_POPULATION } from '../constants'; 

interface StatsDisplayProps {
  simulationState: SimulationState;
}

const StatCard: React.FC<{title: string, value: string | number, color: string, subValue?: string | number, subLabel?: string}> = 
  ({title, value, color, subValue, subLabel}) => (
  <div className={`p-4 rounded-lg shadow-lg bg-gray-700 border-l-4 ${color}`}>
    <h4 className="text-sm text-gray-300 uppercase tracking-wider">{title}</h4>
    <p className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    {subValue !== undefined && subLabel && (
       <p className="text-xs text-gray-400">{subLabel}: {typeof subValue === 'number' ? `+${subValue.toLocaleString()}` : subValue}</p>
    )}
  </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ simulationState }) => {
  const { day, totalSusceptible, totalExposed, totalInfected, totalRecovered, totalDeaths, historicalData } = simulationState;
  const latestDayData = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-sky-400 border-b-2 border-sky-500 pb-2">Current Status - Day {day}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Susceptible" value={totalSusceptible} color="border-blue-500" />
        <StatCard title="Exposed" value={totalExposed} color="border-yellow-400" />
        <StatCard 
            title="Active Infected" 
            value={totalInfected} 
            color="border-red-500" 
            subValue={latestDayData?.newCasesToday ?? 0}
            subLabel="New Cases"
        />
        <StatCard title="Recovered" value={totalRecovered} color="border-green-500" />
        <StatCard 
            title="Deaths" 
            value={totalDeaths} 
            color="border-gray-500"
            subValue={latestDayData?.newDeathsToday ?? 0}
            subLabel="New Deaths"
        />
        <StatCard title="Total Population" value={TOTAL_POPULATION.toLocaleString()} color="border-purple-500" />
      </div>
    </div>
  );
};

export default StatsDisplay;
