export interface OctopusConsumptionResult {
  consumption: number;
  interval_start: string;
  interval_end: string;
}

export interface OctopusResponse {
  count: number;
  next: string;
  previous: string;
  results: OctopusConsumptionResult[];
}

export interface LoaderData {
  dd: number[];
  electric: OctopusResponse;
  gas: OctopusResponse;
  labels: string[];
  totals: Record<string, ReportTotal>;
}

export interface ReportTotal {
  electric: number;
  gas: number;
  combined: number;
}