import type { InferType } from 'yup';
import useLocalStorageState from 'use-local-storage-state';
import { array, lazy, number, object, string } from 'yup';

type ISODate = string;

const energyRateSchema = object({
  standingCharge: number().min(0),
  unitRate: number().min(0),
})

const rateSchema = object({
  electric: energyRateSchema.required(),
  gas: energyRateSchema.required(),
})

export const configAnnotationsSchema = lazy((isoDate: ISODate) => object({ [isoDate]: array().of(string().trim()) }))

export const configDirectDebitsSchema = lazy((isoDate: ISODate) => object({ [isoDate]: number().min(0) }))

export const configRatesSchema = lazy((isoDate: ISODate) => object({ [isoDate]: rateSchema }))

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

export type Rate = InferType<typeof rateSchema>;

export type ConfigAnnotations = InferType<typeof configAnnotationsSchema>;
export type ConfigDirectDebits = InferType<typeof configDirectDebitsSchema>;
export type ConfigRates = InferType<typeof configRatesSchema>;
export type ConfigOctopus = InferType<typeof configOctopusSchema>;

export type Config = {
  annotations: ConfigAnnotations;
  directDebits: ConfigDirectDebits;
  octopus: ConfigOctopus;
  rates: ConfigRates;
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
  const { annotations, setAnnotations } = useAnnotationsConfig();
  const { directDebits, setDirectDebits } = useDirectDebitConfig();
  const { octopus, setOctopus } = useOctopusConfig();
  const { rates, setRates } = useRatesConfig();

  const setConfig = async (config: Config) => {
    await Promise.all([
      configAnnotationsSchema.validate(config.annotations),
      configDirectDebitsSchema.validate(config.directDebits),
      configOctopusSchema.validate(config.octopus),
      configRatesSchema.validate(config.rates),
    ])

    setAnnotations(config.annotations)
    setDirectDebits(config.directDebits)
    setOctopus(config.octopus)
    setRates(config.rates);
  }

  return {
    annotations,
    directDebits,
    octopus,
    rates,
    setConfig
  } as Config & { setConfig(config: Config): void };
}