const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiService {
  constructor() {
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Request failed");
    }

    // For successful DELETE requests with no content, return success
    if (
      response.status === 200 &&
      response.headers.get("Content-Length") === "0"
    ) {
      return { success: true };
    }

    // Try to parse as JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      // If JSON parsing fails but response was successful, return success
      if (response.ok) {
        return { success: true };
      }
      throw new Error("Failed to parse response");
    }
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  // Category endpoints
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createCategory(categoryData) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    });
    return this.handleResponse(response);
  }

  async updateCategory(id, categoryData) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    });
    return this.handleResponse(response);
  }

  async deleteCategory(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Post endpoints
  async getPosts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const response = await fetch(`${API_BASE_URL}/posts?${params}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPost(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createPost(postData) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(postData),
    });
    return this.handleResponse(response);
  }

  async updatePost(id, postData) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(postData),
    });
    return this.handleResponse(response);
  }

  async deletePost(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
