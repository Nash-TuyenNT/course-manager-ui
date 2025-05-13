'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { enrollCourse, getCourseById } from '@/lib/api';
import { CourseDetail } from '@/types/course';
import Loading from '@/components/ui/loading';
import { Lesson } from '@/types/lesson';
import Protected from '@/components/protected';
import { Button } from '@/components/ui/button';

export default function CourseClient() {
    const { id } = useParams();
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id as string);
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);


    const handleEnroll = async () => {
        try {
            setLoading(true);
            await enrollCourse(id as string);
            window.location.reload();//todo redirect to learning page
        } catch (error) {
            console.error('Enroll failed:', error);
            alert('Failed to enroll this course.');
        } finally {
            setLoading(false)
        }
    };

    const handleContinue = () => {
        // TODO: Điều hướng đến bài học đầu tiên chưa học hoặc đầu tiên
        alert('Redirect to lesson not implemented yet');
    };


    if (loading) return <Loading />;
    if (!course) return notFound();

    return (
        <Protected>
            <div className="max-w-3xl mx-auto py-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                    {!course.is_enrolled && (
                        <Button onClick={handleEnroll} >
                            Enroll this course
                        </Button>
                    )}

                    {course.is_enrolled && !course.is_completed && (
                        <Button
                            onClick={handleContinue}
                            variant="outline"
                        >
                            Continute
                        </Button>
                    )}

                    {course.is_enrolled && course.is_completed && (
                        <Button variant="outline" >
                            ✅ Completed
                        </Button>
                    )}
                </div>
                <p className="whitespace-pre-wrap break-words dark:text-gray-400 mb-2">Description: {course.description}</p>
                <p className="dark:text-gray-400 text-sm">Author: {course.creator_id}</p>

                <h2 className="text-2xl font-semibold mb-2">Lessons:</h2>
                <ul className="space-y-2">
                    {course.lessons?.length > 0 ? (
                        course.lessons.sort((a, b) => Number(a.id) - Number(b.id)).map((lesson: Lesson) => (
                            <li key={lesson.id} className="p-3 border rounded shadow-sm">
                                <h3 className="font-semibold">{lesson.title}</h3>
                                <p className="whitespace-pre-wrap break-words text-sm dark:text-gray-300">{lesson.content}</p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400">No lesson found.</p>
                    )}
                </ul>
            </div>
        </Protected>
    );
}
