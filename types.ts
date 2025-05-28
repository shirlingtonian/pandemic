import { SimulationSpeedKey } from './constants'; // Will be needed if constants.ts exports it directly

export enum Policy {
  MaskMandate = 'MASK_MANDATE',
  SchoolClosures = 'SCHOOL_CLOSURES',
  TravelRestrictions = 'TRAVEL_RESTRICTIONS',
  BusinessClosures = 'BUSINESS_CLOSURES',
  // Future: VaccinationDrive = 'VACCINATION_DRIVE',
}

export interface PolicySettings {
  [Policy.MaskMandate]: boolean;
  [Policy.SchoolClosures]: boolean;
  [Policy.TravelRestrictions]: boolean;
  [Policy.BusinessClosures]: boolean;
  // [Policy.VaccinationDrive]: boolean;
}

export interface SimulationControls {
  quarantinePercent: number; // 0-100, % of infected effectively isolated
  socialDistancingPercent: number; // 0-100, % reduction in contacts
  policies: PolicySettings;
  simulationSpeedKey: SimulationSpeedKey; // Added for speed control
}

export interface DayData {
  day: number;
  infected: number;
  deaths: number;
  recovered: number;
  susceptible: number;
  exposed: number;
  newCasesToday: number;
  newDeathsToday: number;
}

export interface CellState {
  id: string;
  row: number;
  col: number;
  susceptible: number;
  exposed: number;
  infected: number;
  recovered: number;
  population: number; // Initial population of the cell
}

export type MapData = CellState[][];

export interface SimulationState {
  day: number;
  totalSusceptible: number;
  totalExposed: number;
  totalInfected: number;
  totalRecovered: number;
  totalDeaths: number;
  historicalData: DayData[];
  mapData: MapData;
  isRunning: boolean;
  currentControls: SimulationControls;
}

export interface PolicyInfo {
  id: Policy;
  label: string;
  description: string;
}