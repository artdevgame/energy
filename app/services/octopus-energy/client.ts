import { DateTime } from 'luxon';

import { fetch } from '@remix-run/node';

import dd from './direct-debits.json';
import rates from './rates.json';

export const makeRequest = async <T = any>(url: string, options: globalThis.RequestInit | undefined = {}) => {
  const uri = `https://api.octopus.energy${url}`

  const res = await fetch(uri, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Basic ${process.env.OCTOPUS_API_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error('Unable to connect to Octopus')
  }

  return res.json() as Promise<T>;
}

export const getDirectDebitAmountForDate = (date: string) => {
  const ddDates = Object.keys(dd);

  function getDirectDebitDate(): string {
    const ddDate = ddDates.shift();

    if (!ddDate) {
      return ddDates[0];
    }

    if (DateTime.fromISO(date) < DateTime.fromISO(ddDate)) {
      return getDirectDebitDate();
    }

    return ddDate;
  }

  const ddDate = getDirectDebitDate() as keyof typeof dd;

  return dd[ddDate];
}

export const getRatesForDate = (date: string) => {
  const ratesDates = Object.keys(rates);

  function getRateDate(): string {
    const ratesDate = ratesDates.shift();

    if (!ratesDate) {
      return ratesDates[0];
    }

    if (DateTime.fromISO(date) < DateTime.fromISO(ratesDate)) {
      return getRateDate();
    }

    return ratesDate;
  }

  const ratesDate = getRateDate() as keyof typeof rates;

  return rates[ratesDate];
}
