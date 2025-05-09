import { Lessons } from "./lesson";

export type Course = {
    id: string;
    title: string;
    description: string;
    creator_id: string;
};

export type UserCourse = {
    id: string;
    title: string;
    description: string;
    creator_id: string;
    progress: number;
    is_completed: boolean;
};

export type CourseDetail = {
    id: string;
    title: string;
    description: string;
    creator_id: string;
    lessons: Array<Lessons>;
    is_enrolled: boolean;
    is_completed: boolean;
}