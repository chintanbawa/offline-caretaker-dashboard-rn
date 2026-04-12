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

async function parseJsonSafe(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiPost<TResponse, TBody>(
  baseUrl: string,
  path: string,
  body: TBody
): Promise<TResponse> {
  const url = `${trimTrailingSlash(baseUrl)}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorBody = await parseJsonSafe(response);
    throw new Error(
      `POST ${path} failed: ${response.status} ${JSON.stringify(errorBody)}`
    );
  }

  return response.json() as Promise<TResponse>;
}
