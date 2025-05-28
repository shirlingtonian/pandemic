
import React from 'react';
import { Policy, SimulationControls, PolicySettings } from '../types';
import { POLICY_DETAILS, SIMULATION_SPEEDS, SimulationSpeedKey } from '../constants';
import PolicyToggle from './PolicyToggle';

interface ControlsPanelProps {
  controls: SimulationControls;
  onUpdateControls: (newControls: Partial<SimulationControls>) => void;
  onTogglePolicy: (policy: Policy) => void;
  onResetSimulation: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
}

const Slider: React.FC<{label: string, id: string, value: number, onChange: (value: number) => void, min?: number, max?: number, step?: number, unit?: string}> = 
    ({label, id, value, onChange, min = 0, max = 100, step = 1, unit= "%"}) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1">
        {label}: <span className="font-bold text-white">{value}{unit}</span>
        </label>
        <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
    </div>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  controls,
  onUpdateControls,
  onTogglePolicy,
  onResetSimulation,
  onTogglePause,
  isPaused,
}) => {
  const handleQuarantineChange = (value: number) => {
    onUpdateControls({ quarantinePercent: value });
  };

  const handleSocialDistancingChange = (value: number) => {
    onUpdateControls({ socialDistancingPercent: value });
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateControls({ simulationSpeedKey: event.target.value as SimulationSpeedKey });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-sky-400 border-b-2 border-sky-500 pb-2">Simulation Controls</h3>
      
      <Slider 
        label="Quarantine Effectiveness"
        id="quarantine"
        value={controls.quarantinePercent}
        onChange={handleQuarantineChange}
        unit="%"
      />
      <p className="text-xs text-gray-400 -mt-3 mb-4">Percentage of infected individuals effectively isolated.</p>


      <Slider 
        label="Social Distancing Compliance"
        id="socialDistancing"
        value={controls.socialDistancingPercent}
        onChange={handleSocialDistancingChange}
        unit="%"
      />
      <p className="text-xs text-gray-400 -mt-3 mb-6">Percentage reduction in contact rates due to distancing.</p>

      <div className="mb-6">
        <label htmlFor="simulationSpeed" className="block text-sm font-medium text-sky-300 mb-1">
          Simulation Speed: <span className="font-bold text-white">{SIMULATION_SPEEDS[controls.simulationSpeedKey].label}</span>
        </label>
        <select
          id="simulationSpeed"
          value={controls.simulationSpeedKey}
          onChange={handleSpeedChange}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-sky-500 focus:border-sky-500"
          aria-label="Select simulation speed"
        >
          {(Object.keys(SIMULATION_SPEEDS) as SimulationSpeedKey[]).map((key) => (
            <option key={key} value={key}>
              {SIMULATION_SPEEDS[key].label}
            </option>
          ))}
        </select>
         <p className="text-xs text-gray-400 mt-1">Adjusts how fast one simulation day passes.</p>
      </div>


      <h4 className="text-xl font-semibold mb-3 text-sky-400">Policies</h4>
      <div className="space-y-3 mb-6">
        {POLICY_DETAILS.map(policyInfo => (
          <PolicyToggle
            key={policyInfo.id}
            policyInfo={policyInfo}
            isActive={controls.policies[policyInfo.id]}
            onToggle={onTogglePolicy}
          />
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onTogglePause}
          className="flex-1 py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition-colors"
          aria-pressed={!isPaused}
        >
          {isPaused ? 'Resume Simulation' : 'Pause Simulation'}
        </button>
        <button
          onClick={onResetSimulation}
          className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;
