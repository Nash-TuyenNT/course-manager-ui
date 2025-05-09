// app/my-courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getCourseByUser } from '@/lib/api';
import Protected from '@/components/protected';
import { useAuth } from '@/components/auth-provider';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import { UserCourse } from '@/types/course';


export default function MyCoursesPage() {
    const [courses, setCourses] = useState<UserCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        const fetchCourses = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getCourseByUser(user)
                    setCourses(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [isAuthenticated, user]);

    if (loading) return <Loading />;

    return (
        <Protected>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">All your courses:</h1>
                {courses.length === 0 ? (
                    <p>You have not joined any courses yet.</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Un-complete courses:</h2>

                        <ul className="grid gap-4">
                            {courses.filter(course => !course.is_completed).map((course) => (
                                <li key={course.id} className="p-4 border rounded-lg p-4 shadow-xl bg-zinc-500 cursor-pointer">
                                    <Link href={`/course/${course.id}`}>
                                        <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                                        <p className="text-gray-300">{course.description}</p>
                                        <small className="text-sm text-gray-400">Author: {course.creator_id}</small>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-bold mb-4">Complete courses:</h2>

                        <ul className="grid gap-4">
                            {courses.filter(course => course.is_completed).map((course) => (
                                <li key={course.id} className="p-4 border rounded-lg p-4 shadow-xl bg-zinc-500 cursor-pointer">
                                    <Link href={`/course/${course.id}`}>
                                        <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                                        <p className="text-gray-300">{course.description}</p>
                                        <small className="text-sm text-gray-400">Author: {course.creator_id}</small>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </Protected>
    );
}
