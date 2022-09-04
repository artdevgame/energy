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