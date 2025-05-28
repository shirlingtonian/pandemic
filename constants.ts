import { Policy, PolicyInfo, PolicySettings } from './types';

export const TOTAL_POPULATION = 1000000;
export const INITIAL_EXPOSED_CELLS = [{ r: 4, c: 4, count: 20 }, {r: 6, c: 6, count: 10}]; // Start in a couple of cells

// SEIR model parameters
export const BASE_TRANSMISSION_RATE = 0.25; // (beta) Avg contacts * probability of transmission per contact
export const INCUBATION_PERIOD_DAYS = 5; // (1/sigma) Avg days from exposed to infectious
export const INFECTION_DURATION_DAYS = 10; // (1/gamma_eff) Avg days an individual is infectious until outcome
export const MORTALITY_RATE = 0.02; // (mu) Probability of death if infected

export const MAP_GRID_SIZE = 10; // 10x10 grid for the map
export const POPULATION_PER_CELL = TOTAL_POPULATION / (MAP_GRID_SIZE * MAP_GRID_SIZE);

// Factor for infection spread influence from neighboring cells
export const NEIGHBOR_SPREAD_FACTOR = 0.05; // Reduced by travel restrictions

export const POLICY_DETAILS: PolicyInfo[] = [
  { id: Policy.MaskMandate, label: "Mask Mandate", description: "Reduces virus transmission probability by 30%." },
  { id: Policy.SchoolClosures, label: "School Closures", description: "Reduces contact rates, contributing to 15% transmission reduction." },
  { id: Policy.TravelRestrictions, label: "Travel Restrictions", description: "Reduces inter-regional spread effectiveness by 70%." },
  { id: Policy.BusinessClosures, label: "Non-Essential Business Closures", description: "Reduces overall community contact, 25% transmission reduction." },
];

export const INITIAL_POLICIES: PolicySettings = {
  [Policy.MaskMandate]: false,
  [Policy.SchoolClosures]: false,
  [Policy.TravelRestrictions]: false,
  [Policy.BusinessClosures]: false,
};

export const POLICY_EFFECTS = {
  [Policy.MaskMandate]: { transmissionReduction: 0.3 },
  [Policy.SchoolClosures]: { transmissionReduction: 0.15 },
  [Policy.TravelRestrictions]: { interCellSpreadReduction: 0.7 },
  [Policy.BusinessClosures]: { transmissionReduction: 0.25 },
};

export const MAX_HISTORY_DAYS = 365; // Cap history for chart performance

// Simulation Speed Control
export const SIMULATION_SPEEDS = {
  SLOW: { label: 'Slow', value: 1000 }, // ms per day
  NORMAL: { label: 'Normal', value: 500 }, // ms per day
  FAST: { label: 'Fast', value: 250 }, // ms per day
  VERY_FAST: { label: 'Very Fast', value: 100 }, // ms per day
} as const; // Use "as const" for stricter typing

export type SimulationSpeedKey = keyof typeof SIMULATION_SPEEDS;
export const DEFAULT_SIMULATION_SPEED_KEY: SimulationSpeedKey = 'NORMAL';