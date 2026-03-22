import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getCourses() {
    return await prisma.courses.findMany({
        include: {
            modules: {
                include: {
                    videos: true
                }
            },
            instructor: true,
            _count: {
                select: { enrollments: true }
            }
        },
        orderBy: { created_at: 'desc' }
    });
}

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Courses Management</h2>
                <Link
                    href="/admin/courses/new"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                    + Add New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            {course.thumbnail_url && (
                                <img
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                    {course.subtitle || course.description || 'No description'}
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-orange-600 font-bold">₹{course.price}</span>
                                    <span className="text-gray-500">{course._count.enrollments} students</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className={`px-2 py-1 text-xs rounded ${course.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {course.is_published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded">
                                        {course.modules.length} modules
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No courses found. Click "Add New Course" to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
