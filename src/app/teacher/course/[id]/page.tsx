'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCourseById, updateCourse, addLessonToCourse } from '@/lib/api'
import { Course } from '@/types/course'
import { useAuth } from '@/components/auth-provider'
import { Lesson } from '@/types/lesson'
import Loading from '@/components/ui/loading'
import Link from 'next/link'
import Protected from '@/components/protected'

export default function EditCoursePage() {
    const { id } = useParams<{ id: string }>()
    const { isAuthenticated, user } = useAuth()

    const [course, setCourse] = useState<Course | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [newLesson, setNewLesson] = useState({ title: '', content: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true)
            try {
                const data = await getCourseById(id)
                setCourse(data)
                setTitle(data.title)
                setDescription(data.description)
                setLessons(data.lessons || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated) fetchCourse()
    }, [id, isAuthenticated])

    const handleUpdateCourse = async () => {
        setLoading(true);
        try {
            await updateCourse(id, JSON.stringify({ title, description, creator_id: user?.user_id }));
            alert('Update course successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update course!');
        } finally {
            setLoading(false);
        }
    }

    const handleAddLesson = async () => {
        try {
            const lesson = await addLessonToCourse(id, JSON.stringify(newLesson))
            setLessons((prev) => [...prev, lesson])
            setNewLesson({ title: '', content: '' })
        } catch (err) {
            console.error(err)
            alert('Failed to add lesson!')
        }
    }

    if (loading) return <Loading />
    if (!course) return <p className="p-4 text-red-500">No courses found</p>

    return (
        <Protected>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Course</h1>

                <div className="space-y-4 mb-8">
                    <input
                        className="w-full border p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Course Title"
                    />
                    <textarea
                        className="w-full border p-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Course Description"
                    />
                    <button
                        onClick={handleUpdateCourse}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-2">Lessons List</h2>
                <ul className="mb-6">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className="border p-3 mb-2 rounded">
                            <Link href={`/teacher/course/${course.id}/lesson/${lesson.id}`}>
                                <h3 className="font-semibold">{lesson.title}</h3>
                                <p className="whitespace-pre-wrap break-words dark:text-gray-300">{lesson.content}</p>
                            </Link>
                        </li>
                    ))}
                </ul>

                <h2 className="text-xl font-semibold mb-2">Add New Lesson</h2>
                <div className="space-y-2">
                    <input
                        className="w-full border p-2"
                        placeholder="Lesson Title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <textarea
                        className="w-full border p-2"
                        placeholder="Lesson Content"
                        value={newLesson.content}
                        onChange={(e) => setNewLesson((prev) => ({ ...prev, content: e.target.value }))}
                    />
                    <button
                        onClick={handleAddLesson}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        + Add Lesson
                    </button>
                </div>
            </div>
        </Protected >
    )
}
