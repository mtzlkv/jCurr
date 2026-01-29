export class ApiClient {
  private static async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async get<T>(url: string): Promise<T> {
    return this.fetchJson<T>(url);
  }
}
