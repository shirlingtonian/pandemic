
import { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationState, SimulationControls, Policy, MapData, CellState, DayData, PolicySettings } from '../types';
import {
  TOTAL_POPULATION,
  INITIAL_EXPOSED_CELLS,
  BASE_TRANSMISSION_RATE,
  INCUBATION_PERIOD_DAYS,
  INFECTION_DURATION_DAYS,
  MORTALITY_RATE,
  MAP_GRID_SIZE,
  POPULATION_PER_CELL,
  NEIGHBOR_SPREAD_FACTOR,
  POLICY_EFFECTS,
  INITIAL_POLICIES,
  MAX_HISTORY_DAYS,
  SIMULATION_SPEEDS,
  DEFAULT_SIMULATION_SPEED_KEY
} from '../constants';

const initializeMapData = (): MapData => {
  const grid: MapData = [];
  for (let r = 0; r < MAP_GRID_SIZE; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < MAP_GRID_SIZE; c++) {
      row.push({
        id: `cell-${r}-${c}`,
        row: r,
        col: c,
        susceptible: POPULATION_PER_CELL,
        exposed: 0,
        infected: 0,
        recovered: 0,
        population: POPULATION_PER_CELL,
      });
    }
    grid.push(row);
  }

  INITIAL_EXPOSED_CELLS.forEach(initCell => {
    if (initCell.r < MAP_GRID_SIZE && initCell.c < MAP_GRID_SIZE) {
      const cell = grid[initCell.r][initCell.c];
      const initialExposedCount = Math.min(cell.susceptible, initCell.count);
      cell.exposed = initialExposedCount;
      cell.susceptible -= initialExposedCount;
    }
  });
  return grid;
};

const usePandemicSimulation = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>(() => {
    const initialMapData = initializeMapData();
    let initialSusceptible = 0;
    let initialExposed = 0;
    initialMapData.flat().forEach(cell => {
        initialSusceptible += cell.susceptible;
        initialExposed += cell.exposed;
    });

    return {
      day: 0,
      totalSusceptible: initialSusceptible,
      totalExposed: initialExposed,
      totalInfected: 0,
      totalRecovered: 0,
      totalDeaths: 0,
      historicalData: [],
      mapData: initialMapData,
      isRunning: false,
      currentControls: {
        quarantinePercent: 10,
        socialDistancingPercent: 10,
        policies: { ...INITIAL_POLICIES },
        simulationSpeedKey: DEFAULT_SIMULATION_SPEED_KEY,
      },
    };
  });

  const simulationIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    const initialMapData = initializeMapData();
    let initialSusceptible = 0;
    let initialExposed = 0;
    initialMapData.flat().forEach(cell => {
        initialSusceptible += cell.susceptible;
        initialExposed += cell.exposed;
    });

    setSimulationState(prevState => ({
      ...prevState, 
      day: 0,
      totalSusceptible: initialSusceptible,
      totalExposed: initialExposed,
      totalInfected: 0,
      totalRecovered: 0,
      totalDeaths: 0,
      historicalData: [],
      mapData: initialMapData,
      isRunning: false,
      currentControls: { // Reset controls to default, including speed
        ...prevState.currentControls, // keep existing slider/policy values unless specified
         quarantinePercent: 10, // Or whatever default you prefer
         socialDistancingPercent: 10, // Or whatever default
         policies: { ...INITIAL_POLICIES },
         simulationSpeedKey: DEFAULT_SIMULATION_SPEED_KEY,
      }
    }));
  }, []);

  const advanceDay = useCallback(() => {
    setSimulationState(prev => {
      const { mapData, currentControls, day } = prev;
      const nextMapData: MapData = JSON.parse(JSON.stringify(mapData)); 

      let dailyNewCases = 0;
      let dailyNewDeaths = 0;
      let currentTotalSusceptible = 0;
      let currentTotalExposed = 0;
      let currentTotalInfected = 0;
      let currentTotalRecovered = 0;
      let currentTotalDeaths = prev.totalDeaths;

      let effectiveTransmissionRate = BASE_TRANSMISSION_RATE * (1 - currentControls.socialDistancingPercent / 100);
      if (currentControls.policies[Policy.MaskMandate]) effectiveTransmissionRate *= (1 - POLICY_EFFECTS[Policy.MaskMandate].transmissionReduction);
      if (currentControls.policies[Policy.SchoolClosures]) effectiveTransmissionRate *= (1 - POLICY_EFFECTS[Policy.SchoolClosures].transmissionReduction);
      if (currentControls.policies[Policy.BusinessClosures]) effectiveTransmissionRate *= (1 - POLICY_EFFECTS[Policy.BusinessClosures].transmissionReduction);
      
      const sigma = 1 / INCUBATION_PERIOD_DAYS; 
      const gamma_eff = 1 / INFECTION_DURATION_DAYS;

      for (let r = 0; r < MAP_GRID_SIZE; r++) {
        for (let c = 0; c < MAP_GRID_SIZE; c++) {
          const cell = mapData[r][c];
          const nextCell = nextMapData[r][c];

          let neighborInfectionPressure = 0;
          const neighbors = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1], [-1,1], [1,-1], [1,1]];
          neighbors.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < MAP_GRID_SIZE && nc >= 0 && nc < MAP_GRID_SIZE) {
              neighborInfectionPressure += mapData[nr][nc].infected;
            }
          });
          
          let interCellSpreadFactor = NEIGHBOR_SPREAD_FACTOR;
          if (currentControls.policies[Policy.TravelRestrictions]) {
            interCellSpreadFactor *= (1 - POLICY_EFFECTS[Policy.TravelRestrictions].interCellSpreadReduction);
          }
          
          const effectiveInfectedForSpread = cell.infected * (1 - currentControls.quarantinePercent / 100);
          const totalInfectionPressure = effectiveInfectedForSpread + (neighborInfectionPressure * interCellSpreadFactor);

          const newExposedInCell = (effectiveTransmissionRate * cell.susceptible * totalInfectionPressure) / Math.max(1, cell.population);
          const actualNewExposed = Math.min(cell.susceptible, Math.max(0, newExposedInCell));
          
          const newInfectedFromExposed = sigma * cell.exposed;
          const actualNewInfected = Math.min(cell.exposed, Math.max(0, newInfectedFromExposed));
          dailyNewCases += actualNewInfected;

          const newLeavingInfected = gamma_eff * cell.infected;
          const actualLeavingInfected = Math.min(cell.infected, Math.max(0, newLeavingInfected));
          
          const newDeathsInCell = actualLeavingInfected * MORTALITY_RATE;
          const actualNewDeaths = Math.max(0, newDeathsInCell);
          dailyNewDeaths += actualNewDeaths;

          const newRecoveredInCell = actualLeavingInfected * (1 - MORTALITY_RATE);
          const actualNewRecovered = Math.max(0, newRecoveredInCell);

          nextCell.susceptible = Math.max(0, cell.susceptible - actualNewExposed);
          nextCell.exposed = Math.max(0, cell.exposed + actualNewExposed - actualNewInfected);
          nextCell.infected = Math.max(0, cell.infected + actualNewInfected - actualNewDeaths - actualNewRecovered);
          nextCell.recovered = Math.max(0, cell.recovered + actualNewRecovered);
        }
      }
      
      nextMapData.flat().forEach(cell => {
        currentTotalSusceptible += cell.susceptible;
        currentTotalExposed += cell.exposed;
        currentTotalInfected += cell.infected;
        currentTotalRecovered += cell.recovered;
      });
      currentTotalDeaths += Math.floor(dailyNewDeaths);

      const newHistoricalData: DayData = {
        day: day + 1,
        susceptible: Math.floor(currentTotalSusceptible),
        exposed: Math.floor(currentTotalExposed),
        infected: Math.floor(currentTotalInfected),
        recovered: Math.floor(currentTotalRecovered),
        deaths: Math.floor(currentTotalDeaths),
        newCasesToday: Math.floor(dailyNewCases),
        newDeathsToday: Math.floor(dailyNewDeaths), 
      };
      
      const updatedHistory = [...prev.historicalData, newHistoricalData];
      if (updatedHistory.length > MAX_HISTORY_DAYS) {
        updatedHistory.shift();
      }

      return {
        ...prev,
        day: day + 1,
        totalSusceptible: Math.floor(currentTotalSusceptible),
        totalExposed: Math.floor(currentTotalExposed),
        totalInfected: Math.floor(currentTotalInfected),
        totalRecovered: Math.floor(currentTotalRecovered),
        totalDeaths: Math.floor(currentTotalDeaths),
        mapData: nextMapData,
        historicalData: updatedHistory,
      };
    });
  }, []);


  useEffect(() => {
    if (simulationState.isRunning) {
      if (simulationIntervalRef.current) { // Clear previous interval if speed changed while running
        clearInterval(simulationIntervalRef.current);
      }
      const speedMs = SIMULATION_SPEEDS[simulationState.currentControls.simulationSpeedKey].value;
      simulationIntervalRef.current = setInterval(advanceDay, speedMs);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [simulationState.isRunning, simulationState.currentControls.simulationSpeedKey, advanceDay]);

  const updateControls = useCallback((newControls: Partial<SimulationControls>) => {
    setSimulationState(prev => ({
      ...prev,
      currentControls: { ...prev.currentControls, ...newControls },
    }));
  }, []);
  
  const togglePolicy = useCallback((policyToToggle: Policy) => {
    setSimulationState(prev => {
      const newPolicies: PolicySettings = {
        ...prev.currentControls.policies,
        [policyToToggle]: !prev.currentControls.policies[policyToToggle],
      };
      return {
        ...prev,
        currentControls: {
          ...prev.currentControls,
          policies: newPolicies,
        },
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setSimulationState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  return {
    simulationState,
    updateControls,
    togglePolicy,
    resetSimulation,
    togglePause,
  };
};

export default usePandemicSimulation;
