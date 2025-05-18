import axios, { AxiosError } from "axios";

interface IRequestHandler {
  method: "POST" | "GET" | "PUT" | "DELETE";
  endpoint: string;
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
  endpoint,
  data = null,
  headers = {},
  params = {},
}: IRequestHandler) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      headers,
      params,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
};
