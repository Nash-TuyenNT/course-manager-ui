import { JwtUser } from '@/types/user';
import { apiFetch } from './api-client';
import { API_PATH } from './constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function authenticate(username: string, password: string) {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const res = await apiFetch(`${BASE_URL}${API_PATH.LOGIN}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Login failed');
    }

    return res.json();
}

export async function register(username: string, password: string, role: string, email: string) {
    if (!username || !password || !role || !email) {
        throw new Error('Missing required fields')
    }

    const res = await apiFetch(`${BASE_URL}${API_PATH.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            password,
            email,
            role,
        }),
    })

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Register failed');
    }

    return res.json();
}


export async function getCourse() {
    const res = await apiFetch(`${BASE_URL}${API_PATH.COURSES}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to get courses');
    }

    return res.json();
}

export async function getCourseByUser(user: JwtUser | null) {
    if (!user)
        throw new Error('Unauthorized - User not found');
    const res = await apiFetch(`${BASE_URL}${API_PATH.MY_COURSE(user.user_id)}`);
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to get courses');
    }
    return res.json();
}

export async function getCourseById(id: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.COURSES}${id}`);
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to get courses');
    }

    return res.json();
}

export async function enrollCourse(courseId: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.ENROLL_COURSE(courseId)}`, {
        method: 'POST',
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to enroll this course');
    }

    return res.json();
}

export async function sendMessageToBot(message: string) {
    const res = await fetch(`${BASE_URL}${API_PATH.CHATBOT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ message: message }),
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to send message');
    }

    return res.json();
}