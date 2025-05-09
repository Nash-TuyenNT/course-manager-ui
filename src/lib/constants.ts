export const API_PATH = {
    LOGIN: '/login',
    REGISTER: '/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    COURSES: '/courses/',
    MY_COURSE: (id: string | number) => `/courses/by-user/${id}`, //with user_id in path variable
    ENROLL_COURSE: (id: string | number) => `/courses/${id}/enroll`
}
