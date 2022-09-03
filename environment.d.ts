export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ELECTRIC_MPAN: string;
      ELECTRIC_SERIAL: string;
      GAS_MPRN: string;
      GAS_SERIAL: string;
      OCTOPUS_API_KEY: string;
    }
  }
}