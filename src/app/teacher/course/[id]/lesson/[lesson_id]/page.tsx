'use client'

import { useAuth } from "@/components/auth-provider"
import Protected from "@/components/protected"
import QuizQuestionForm from "@/components/quiz-question"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loading from "@/components/ui/loading"
import { createQuiz, getLessonDetail, updateLesson } from "@/lib/api"
import { LessonDetail } from "@/types/lesson"
import { Question } from "@/types/question"
import { Quiz, QuizCreate } from "@/types/quiz"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LessonPage() {
    const { lesson_id } = useParams<{ lesson_id: string }>()
    const { isAuthenticated } = useAuth()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [lessons, setLessons] = useState<LessonDetail>()
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null)
    const [newQuiz, setNewQuiz] = useState<QuizCreate>({
        title: '',
        lesson_id: '',
        max_attempts: null,
        questions: []
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const lesson = await getLessonDetail(lesson_id);
                setTitle(lesson.title);
                setContent(lesson.content);
                setLessons(lesson);
                setQuizzes(lesson.quiz);
            } catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        if (isAuthenticated) fetchCourse();
    }, [isAuthenticated, lesson_id])

    if (loading) return <Loading />;
    if (!lessons) return <p className="p-4 text-red-500">No lessons found</p>;

    const handleUpdateLesson = async () => {
        setLoading(true);
        try {
            await updateLesson(lesson_id, JSON.stringify({ title, content }));
            alert('Update lesson successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update lesson!: ' + err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuiz = async () => {
        setLoading(true);
        try {
            const quiz = await createQuiz({ ...newQuiz, lesson_id, questions });
            setQuizzes((prev) => [...prev, quiz]);
            setNewQuiz({
                title: '',
                lesson_id: lessons.id,
                max_attempts: null,
                questions: []
            })
            setQuestions([])
        } catch (err) {
            console.error(err)
            alert('Failed to add quiz!')
        } finally {
            setLoading(false);
        }
    }

    const toggleQuiz = (id: number) => {
        setExpandedQuizId(prev => (prev === id ? null : id))
    }

    return (
        <Protected>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Lesson</h1>

                <div className="space-y-4 mb-8">
                    <Input
                        className="w-full border p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Lesson Title"
                    />
                    <textarea
                        className="w-full border p-2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Lesson Description"
                    />
                    <button
                        onClick={handleUpdateLesson}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-2">Quizzes List</h2>
                <ul className="mb-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="border rounded-md overflow-hidden">
                            <button
                                onClick={() => toggleQuiz(quiz.id)}
                                className="w-full text-left px-4 py-3 dark:bg-gray-800 font-semibold"
                            >
                                {quiz.title} (Tối đa {quiz.max_attempts} lần làm)
                            </button>

                            {expandedQuizId === quiz.id && (
                                <div className="px-4 py-3 space-y-4 dark:bg-gray-900">
                                    {quiz.questions.map((q, i) => (
                                        <div key={i} className="border p-3 rounded">
                                            <p className="font-medium mb-2">
                                                Câu {i + 1}: {q.question}
                                            </p>
                                            <ul className="list-disc list-inside pl-2 space-y-1">
                                                {q.choices.map((choice, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={choice === q.correct_answer ? 'text-green-600 font-semibold' : ''}
                                                    >
                                                        {choice}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </ul>

                <h2 className="text-xl font-semibold mb-2">Add New Quiz</h2>
                <div className="space-y-2">
                    <Input
                        className="w-full border p-2"
                        placeholder="Quiz Title"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                        className="w-full border p-2"
                        placeholder="Quiz max attempts"
                        value={newQuiz.max_attempts!}
                        type="number"
                        onChange={(e) => setNewQuiz((prev) => ({ ...prev, max_attempts: Number(e.target.value) }))}
                    />
                    <div className="px-4 py-3 space-y-4 dark:bg-gray-900">
                        <QuizQuestionForm questions={questions} setQuestions={setQuestions} />
                    </div>
                    <Button
                        onClick={handleAddQuiz}
                        className="px-4 py-2 rounded"
                    >
                        + Add Quiz
                    </Button>
                </div>
            </div>
        </Protected>
    )

}