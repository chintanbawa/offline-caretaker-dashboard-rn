function trimTrailingSlash(input: string) {
  return input.replace(/\/+$/, '');
}

export async function apiGet<T>(baseUrl: string, path: string): Promise<T> {
  const url = `${trimTrailingSlash(baseUrl)}${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
