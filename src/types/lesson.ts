import { Quiz } from "./quiz";

export type Lesson = {
    id: string;
    title: string;
    content: string;
}

export type LessonDetail = {
    id: string;
    title: string;
    content: string;
    quiz: Array<Quiz>;
}