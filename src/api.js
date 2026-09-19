const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function getJSON(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }
  return response.json()
}
