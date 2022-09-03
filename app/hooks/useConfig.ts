import useLocalStorageState from 'use-local-storage-state';

type ISODate = string;

interface EnergyRate {
  standingCharge: number;
  unitRate: number;
}

export type ConfigAnnotations = Record<ISODate, string[]>;

export type ConfigDirectDebits = Record<ISODate, number>;

export type ConfigRates = Record<ISODate, {
  electric: EnergyRate;
  gas: EnergyRate;
}>;

export interface ConfigOctopus {
  apiKey: string;
  electric: {
    mpan: string;
    serial: string;
  };
  gas: {
    mprn: string;
    serial: string;
  };
}

const ns = 'energy.highsnr.dev';

export const useAnnotationsConfig = () => {
  const [annotations, setAnnotations] = useLocalStorageState<ConfigAnnotations>(`${ns}:annotations`, {
    defaultValue: {}
  })

  return { annotations, setAnnotations }
}

export const useDirectDebitConfig = () => {
  const [directDebits, setDirectDebits] = useLocalStorageState<ConfigDirectDebits>(`${ns}:direct-debits`, {
    defaultValue: {}
  })

  return { directDebits, setDirectDebits }
}

export const useOctopusConfig = () => {
  const [octopus, setOctopus] = useLocalStorageState<ConfigOctopus>(`${ns}:octopus`, {
    defaultValue: {
      apiKey: '',
      electric: { mpan: '', serial: '' },
      gas: { mprn: '', serial: '' },
    }
  })

  return { octopus, setOctopus }
}

export const useRatesConfig = () => {
  const [rates, setRates] = useLocalStorageState<ConfigRates>(`${ns}:rates`, {
    defaultValue: {}
  })

  return { rates, setRates }
}

export const useConfig = () => {
  const { annotations } = useAnnotationsConfig();
  const { directDebits } = useDirectDebitConfig();
  const { octopus } = useOctopusConfig();
  const { rates } = useRatesConfig();

  return {
    annotations,
    directDebits,
    octopus,
    rates
  }
}