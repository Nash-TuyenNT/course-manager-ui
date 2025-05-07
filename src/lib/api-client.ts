// lib/api-client.ts

import { API_PATH } from "./constants";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        isRefreshing = true;
        refreshPromise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_PATH.REFRESH_TOKEN}`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) return null;
                const data = await res.json();
                localStorage.setItem('access_token', data.access_token);
                return data.access_token;
            })
            .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('access_token');
    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);

    let response = await fetch(input, {
        ...init,
        headers,
        credentials: 'include',
    });

    if (response.status === 401 && token && !isRefreshing) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            const retryHeaders = new Headers(init.headers || {});
            retryHeaders.set('Authorization', `Bearer ${newToken}`);

            response = await fetch(input, {
                ...init,
                headers: retryHeaders,
                credentials: 'include',
            });
        }
    }

    return response;
}
