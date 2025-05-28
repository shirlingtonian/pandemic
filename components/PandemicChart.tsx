
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DayData } from '../types';

interface PandemicChartProps {
  historicalData: DayData[];
}

const PandemicChart: React.FC<PandemicChartProps> = ({ historicalData }) => {
  if (!historicalData || historicalData.length === 0) {
    return <div className="p-6 bg-gray-800 rounded-xl shadow-2xl text-center text-gray-400">No data to display yet. Run the simulation.</div>;
  }
  
  // Downsample data if too large for performance.
  // For example, show every Nth point if data.length > MAX_POINTS_ON_CHART
  const chartData = historicalData; // Simple for now, no downsampling

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl h-96">
      <h3 className="text-2xl font-bold mb-6 text-sky-400 border-b-2 border-sky-500 pb-2">Pandemic Progression</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="day" stroke="#A0AEC0" label={{ value: 'Day', position: 'insideBottomRight', offset: -10, fill: '#A0AEC0' }} />
          <YAxis stroke="#A0AEC0" tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip
            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
            itemStyle={{ color: '#A0AEC0' }}
            formatter={(value: number, name: string) => [value.toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)]}
          />
          <Legend wrapperStyle={{ color: '#A0AEC0' }} />
          <Line type="monotone" dataKey="infected" stroke="#F56565" strokeWidth={2} name="Active Infected" dot={false} />
          <Line type="monotone" dataKey="exposed" stroke="#ECC94B" strokeWidth={2} name="Exposed" dot={false} />
          <Line type="monotone" dataKey="deaths" stroke="#718096" strokeWidth={2} name="Total Deaths" dot={false} />
          <Line type="monotone" dataKey="recovered" stroke="#48BB78" strokeWidth={2} name="Total Recovered" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PandemicChart;
