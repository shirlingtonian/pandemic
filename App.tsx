
import React from 'react';
import ControlsPanel from './components/ControlsPanel';
import StatsDisplay from './components/StatsDisplay';
import PandemicChart from './components/PandemicChart';
import HotspotMap from './components/HotspotMap';
import usePandemicSimulation from './hooks/usePandemicSimulation';

const App: React.FC = () => {
  const {
    simulationState,
    updateControls,
    togglePolicy,
    resetSimulation,
    togglePause,
  } = usePandemicSimulation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-sky-400">Pandemic Dynamics Simulator</h1>
        <p className="text-gray-400 mt-2 text-sm lg:text-base">
          Adjust controls and policies to observe their impact on the pandemic spread.
        </p>
      </header>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ControlsPanel
            controls={simulationState.currentControls}
            onUpdateControls={updateControls}
            onTogglePolicy={togglePolicy}
            onResetSimulation={resetSimulation}
            onTogglePause={togglePause}
            isPaused={!simulationState.isRunning}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <StatsDisplay simulationState={simulationState} />
          <PandemicChart historicalData={simulationState.historicalData} />
          <HotspotMap mapData={simulationState.mapData} />
        </div>
      </div>

      <footer className="text-center mt-12 py-4 border-t border-gray-700">
        <p className="text-sm text-gray-500">
          Disclaimer: This is a simplified educational model and not a prediction tool.
        </p>
      </footer>
    </div>
  );
};

export default App;
