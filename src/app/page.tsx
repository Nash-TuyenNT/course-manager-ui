'use client';

import Protected from "@/components/protected";
import { getCourse } from "@/lib/api";
import { Course } from "@/types/course";
import { useState, useEffect } from "react";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourse()
        setCourses(data);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-4 text-lg">Loading...</div>;

  return (
    <Protected>
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Courses:</h1>
        {courses.length === 0 ? (
          <div>No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 shadow-xl bg-zinc-500">
                <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                <p className="text-sm text-gray-300">{course.description}</p>
                <p className="text-xs mt-2 text-gray-400">Created by: {course.creator_id}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </Protected>
  );
}
