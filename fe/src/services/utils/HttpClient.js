import delay from '../../utils/delay';
import APIError from '../../errors/APIError';

class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    await delay(2000);

    const response = await fetch(`${this.baseUrl}${path}`);

    let body = null;

    const contentType = response.headers.get('Content-Type');

    if (contentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new APIError(response, body);
  }

  async post(path, body = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      body: body && JSON.stringify(body),
    });

    await delay(500);

    return response.json();
  }

  async put(path, body = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      body: body && JSON.stringify(body),
    });

    await delay(500);

    return response.json();
  }

  async delete(path, body = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      body: body && JSON.stringify(body),
    });

    await delay(500);

    return response.json();
  }
}

export default HttpClient;
