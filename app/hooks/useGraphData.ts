import { DateTime } from 'luxon';
import { useOctopusData } from '~/features/config/ConfigOctopus/octopusContext';
import { sortObjectByKeys } from '~/libs/objectUtils';

import { useDirectDebitConfig, useRatesConfig } from './useConfig';

import type { OctopusConsumptionResult } from '~/services/octopus-energy/types';
import type { ConfigDirectDebits, ConfigRates, Rate } from './useConfig';
type EnergyType = 'electric' | 'gas';

export interface GraphData {
  dd: number[];
  electric: OctopusConsumptionResult[] | null;
  gas: OctopusConsumptionResult[] | null;
  labels: string[];
  totals: Record<string, ReportTotal>;
}

interface ReportTotal {
  electric: number;
  gas: number;
  combined: number;
}

export const useGraphData = () => {
  const { rates } = useRatesConfig();
  const { directDebits } = useDirectDebitConfig();
  const { state: { electric, gas } } = useOctopusData();

  if (!electric.length && !gas.length) {
    return {
      dd: [],
      electric: null,
      gas: null,
      labels: [],
      totals: {},
    } as GraphData;
  }

  const dates = getDates({ results: electric.length ? electric : gas });

  const labels = getLabels({ dates });
  const dd = getValuesWithClosestDate<number>({ dates, config: directDebits });

  const totals = getTotals({ dates, electric, gas, rates })

  return { dd, electric, gas, labels, totals };
}

const getDates = ({ results }: { results: OctopusConsumptionResult[] }) => results.map((reading) =>
  DateTime.fromISO(reading.interval_end).toUTC()
)

const getItemTotal = ({
  consumed,
  date,
  energyType,
  rates,
}: {
  consumed: number;
  date: DateTime;
  energyType: EnergyType;
  rates: Rate;
}) => {
  const supply = rates?.[energyType];

  if (!supply) return 0;

  const kWh = energyType === 'gas' ? toKWh(consumed) : consumed

  const energyCharge = Number(((supply.unitRate! / 100) * kWh).toFixed(2));

  const standingCharge = Number(
    ((supply.standingCharge! / 100) * date.daysInMonth).toFixed(2)
  );

  const subTotal = energyCharge + standingCharge;
  const vat = Number((subTotal * 0.05).toFixed(2));
  const total = Number((subTotal + vat).toFixed(2));

  return total;
};

const getLabels = ({ dates }: { dates: DateTime[] }) => dates.map((date) => date.toISODate())

const getTotals = ({ dates, electric, gas, rates }: { dates: DateTime[]; electric: OctopusConsumptionResult[]; gas: OctopusConsumptionResult[]; rates: ConfigRates }) => {
  const totals: Record<string, ReportTotal> = {};
  const allRates = getValuesWithClosestDate<Rate>({ dates, config: rates });

  for (const dateIndex in dates) {
    const date = dates[dateIndex];
    const ratesForDate = allRates[dateIndex];

    const electricTotal = electric[dateIndex] ? getItemTotal({
      consumed: electric[dateIndex].consumption,
      energyType: "electric",
      date,
      rates: ratesForDate
    }) : 0;

    const gasTotal = gas[dateIndex] ? getItemTotal({
      consumed: gas[dateIndex].consumption,
      energyType: "gas",
      date,
      rates: ratesForDate
    }) : 0;

    const combinedTotal = Number((electricTotal + gasTotal).toFixed(2));

    totals[date.toISODate()] = {
      combined: combinedTotal,
      electric: electricTotal,
      gas: gasTotal,
    };
  }

  return totals;
}

const getValuesWithClosestDate = <T>({ dates, config }: { dates: DateTime[]; config: ConfigDirectDebits | ConfigRates }) => dates.map(date => {
  const allDates = Object.keys(sortObjectByKeys(config, true));

  function getDate(): string {
    const currentDate = allDates.shift();

    if (!currentDate) {
      return allDates[0];
    }

    if (date < DateTime.fromISO(currentDate)) {
      return getDate();
    }

    return currentDate;
  }

  const foundDate = getDate() as keyof typeof config;

  return config[foundDate] as T;
})

export const toKWh = (cubicMetres: number) => {
  const volumeCorrection = 1.02264
  const calorificValue = 39.4
  const joules = 3.6
  return (cubicMetres * volumeCorrection * calorificValue) / joules
}