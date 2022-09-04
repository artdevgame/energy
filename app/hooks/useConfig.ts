import type { InferType } from 'yup';
import useLocalStorageState from 'use-local-storage-state';
import { object, string } from 'yup';

type ISODate = string;

interface EnergyRate {
  standingCharge: number;
  unitRate: number;
}

export interface Rate {
  electric: EnergyRate;
  gas: EnergyRate;
}

export type ConfigAnnotations = Record<ISODate, string[]>;

export type ConfigDirectDebits = Record<ISODate, number>;

export type ConfigRates = Record<ISODate, Rate>;

export const configOctopusSchema = object({
  apiKey: string().trim().required(),
  electric: object({
    mpan: string().trim().required(),
    serial: string().trim().required(),
  }).required(),
  gas: object({
    mprn: string().trim().required(),
    serial: string().trim().required(),
  }).required()
})

export type ConfigOctopus = InferType<typeof configOctopusSchema>;

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