import { env } from "../config/env";

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function httpClient(options: RequestOptions) {
    const response = await fetch(`${env.BASE_URL}${options.url}`, {
        method: options.method,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : ""
    })

    const data = await response.json().catch(() => null)

    return {
        status: response.status,
        headers: response.headers,
        data
    }

}