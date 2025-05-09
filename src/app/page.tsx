'use client';

import { useAuth } from "@/components/auth-provider";
import Protected from "@/components/protected";
import Loading from "@/components/ui/loading";
import { getCourse } from "@/lib/api";
import { Course } from "@/types/course";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchCourses = async () => {
      if (isAuthenticated) {
        try {
          const data = await getCourse();
          setCourses(data);
        } catch (err) {
          console.error('Error loading courses:', err);
        } finally {
          setLoading(false);
        }
      } else setLoading(false);
    };

    fetchCourses();
  }, [isAuthenticated]);

  if (loading) return <Loading />;

  return (
    <Protected>
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Courses:</h1>
        {courses.length === 0 ? (
          <div>No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link href={`/course/${course.id}`} key={course.id}>
                <div className="border rounded-lg p-4 shadow-xl bg-zinc-500 cursor-pointer">
                  <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                  <p className="text-sm text-gray-300">{course.description}</p>
                  <p className="text-xs mt-2 text-gray-400">Created by: {course.creator_id}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </Protected>
  );
}
