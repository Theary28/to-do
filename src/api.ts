export const BASE_URL = 'https://jsonplaceholder.typicode.com'

export class HttpError extends Error {
  status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.status = status
  }
}

export async function getJSON<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) throw new HttpError(response.status)
  return response.json() as Promise<T>
}
