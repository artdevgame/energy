export { }

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OCTOPUS_API_KEY: string;
    }
  }
}