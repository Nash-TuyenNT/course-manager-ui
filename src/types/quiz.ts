import { Question } from "./question";

export type Quiz = {
    id: number;
    title: string;
    max_attempts: number | null;
    questions: Array<Question>;
}

export type QuizCreate = {
    lesson_id: string
    title: string;
    max_attempts: number | null;
    questions: Array<Question>;
}