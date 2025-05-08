import axios, { AxiosError } from "axios";

interface IRequestHandler {
  method: "POST" | "GET" | "PUT" | "DELETE";
  url: string;
  data?: any;
  headers?: any;
  params?: Record<string, any>;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const requestHandler = async ({
  method,
  url,
  data = null,
  headers = {},
  params = {},
}: IRequestHandler) => {
  try {
    const response = await api({
      method,
      url,
      data,
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
};
