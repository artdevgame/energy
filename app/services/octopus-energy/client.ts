interface MakeRequestOptions extends globalThis.RequestInit {
  apiKey?: string;
}

export const makeRequest = async <T = any>(url: string, options: MakeRequestOptions | undefined = {}) => {
  if (!options.apiKey) {
    throw new Error('Octopus API key missing')
  }

  const uri = `https://api.octopus.energy${url}`

  const res = await fetch(uri, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Basic ${btoa(options.apiKey + ':')}`
    }
  });

  if (!res.ok) {
    throw new Error('Unable to connect to Octopus')
  }

  return res.json() as Promise<T>;
}
