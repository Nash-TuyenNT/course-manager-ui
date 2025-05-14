import { JwtUser } from '@/types/user';
import { apiFetch } from './api-client';
import { API_PATH } from './constants';
import { QuizCreate } from '@/types/quiz';
import { Message } from '@/components/chat-box';

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

export async function sendMessageToBot(input: string, history: Message[]) {
    const res = await fetch(`${BASE_URL}${API_PATH.CHATBOT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ input, history }),
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to send message');
    }

    return res.json();
}

export async function createCourse(course: { title: string; description: string }) {
    if (!course.title || !course.description) {
        throw new Error('Title and description are required');
    }

    const res = await apiFetch(`${BASE_URL}${API_PATH.COURSES}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(course),
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to create course');
    }

    return res.json();
}

export async function getCoursesByCreator(user: JwtUser | null) {
    if (!user)
        throw new Error('Unauthorized - User not found');
    const res = await apiFetch(`${BASE_URL}${API_PATH.COURSES}?creator=${user.user_id}`)

    if (!res.ok) {
        throw new Error('Failed to fetch courses');
    }

    return res.json()
}

export async function updateCourse(id: string, body: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.COURSES}${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: body,
    })

    if (!res.ok) throw new Error('Failed to update course')
    return res.json()
}

export async function addLessonToCourse(courseId: string, lesson: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.NEW_LESSON(courseId)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: lesson,
    })

    if (!res.ok) throw new Error('Failed to add lesson')
    return res.json()
}

export async function getLessonByCourseId(courseId: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.NEW_LESSON(courseId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    })

    if (!res.ok) throw new Error('Failed to get lessons')
    return res.json()
}

export async function getLessonDetail(id: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.LESSON(id)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    })

    if (!res.ok) throw new Error('Failed to get lesson detail')
    return res.json()

}

export async function createQuiz(quiz: QuizCreate) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.QUIZ}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(quiz),
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to create quiz');
    }

    return res.json();
}

export async function updateLesson(lesson_id: string, lesson: string) {
    const res = await apiFetch(`${BASE_URL}${API_PATH.LESSON(lesson_id)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: lesson,
    });

    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to create quiz');
    }

    return res.json();
}