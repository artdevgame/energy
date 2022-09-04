import type { ReactNode } from "react";
import { createContext, useContext, useReducer } from 'react';

import type { OctopusConsumptionResult } from "~/services/octopus-energy/types";

type Action =
  | { type: "setElectricResults"; results: OctopusConsumptionResult[] }
  | { type: "setGasResults"; results: OctopusConsumptionResult[] };

export type Dispatch = (action: Action) => void;

interface State {
  electric: OctopusConsumptionResult[];
  gas: OctopusConsumptionResult[];
}

interface OctopusProviderProps {
  children: ReactNode;
}

const OctopusContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const octopusReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setElectricResults":
      return { ...state, electric: action.results };
    case "setGasResults":
      return { ...state, gas: action.results };
    default:
      throw new Error(`Unhandled action type`);
  }
};

export const OctopusProvider = ({ children }: OctopusProviderProps) => {
  const [state, dispatch] = useReducer(octopusReducer, {
    electric: [],
    gas: [],
  });

  const value = { state, dispatch };

  return (
    <OctopusContext.Provider value={value}>{children}</OctopusContext.Provider>
  );
};

export const useOctopusData = () => {
  const ctx = useContext(OctopusContext);

  if (typeof ctx === "undefined") {
    throw new Error("useOctopusContext must be used within a OctopusProvider");
  }

  return ctx;
};
