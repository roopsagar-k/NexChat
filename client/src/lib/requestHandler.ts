import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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
    if(error instanceof AxiosError) {
      toast.error(`Request failed: ${error.response?.data || error.message}`);
    } else {
      toast.error(`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
    throw error;
  }
};
