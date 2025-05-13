'use client'

import { useEffect, useState } from 'react'
import { getCoursesByCreator } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Course } from '@/types/course'
import Loading from '@/components/ui/loading'
import { Button } from '@/components/ui/button'

export default function TeacherProfilePage() {
    const { isAuthenticated, user } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getCoursesByCreator(user)
                setCourses(res)
            } catch (err) {
                console.error('Failed to load teacher courses', err)
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated && user) fetchCourses()
    }, [isAuthenticated, user])

    if (loading) return <Loading />

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <Button
                    className="rounded"
                    onClick={() => router.push('/teacher/course/new')}
                >
                    + Add New Course
                </Button>
            </div>

            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                <ul className="space-y-4">
                    {courses.map((course) => (
                        <li key={course.id} className="border p-4 rounded">
                            <Link href={`/teacher/course/${course.id}`}>
                                <div>
                                    <h2 className="text-xl font-semibold">{course.title}</h2>
                                    <p className="whitespace-pre-wrap break-words dark:text-gray-300">{course.description}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
