import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

async function getStats() {
    const studentCount = await prisma.profiles.count({ where: { role: 'student' } });
    const courseCount = await prisma.courses.count({ where: { is_published: true } });
    const activeSubs = await prisma.enrollments.count();

    // Revenue is sum of amount_paid from enrollments
    const allEnrollments = await prisma.enrollments.findMany({
        include: { course: true }
    });
    const revenue = allEnrollments.reduce((sum, enr) => sum + (enr.amount_paid || enr.course.price), 0);

    const recentActivity = await prisma.enrollments.findMany({
        take: 5,
        orderBy: { enrolled_at: 'desc' },
        include: { user: true, course: true }
    });

    return { studentCount, courseCount, activeSubs, revenue, recentActivity };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={stats.studentCount.toString()} change="All time" />
                <StatCard title="Active Courses" value={stats.courseCount.toString()} change="Published" />
                <StatCard title="Active Enrollments" value={stats.activeSubs.toString()} change="Current" />
                <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} change="Estimated" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <h3 className="text-lg font-bold mb-4">Recent Enrollments</h3>
                    <div className="space-y-4">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    user={activity.user.email || activity.user.full_name || 'Unknown'}
                                    action="enrolled in"
                                    target={activity.course.title}
                                    time={formatDistanceToNow(activity.enrolled_at, { addSuffix: true })}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No recent activity found.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionBtn label="Add New Course" />
                        <ActionBtn label="Schedule Live Class" />
                        <ActionBtn label="Upload Notes" />
                        <ActionBtn label="View Reports" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            <p className="text-sm text-green-600 mt-2 font-medium">{change}</p>
        </div>
    );
}

function ActivityItem({ user, action, target, time }: { user: string; action: string; target: string; time: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-zinc-700 last:border-0">
            <div>
                <span className="font-semibold text-gray-900 dark:text-white">{user}</span>
                <span className="text-gray-500 text-sm ml-1">{action}</span>
                <p className="text-sm text-orange-600 font-medium">{target}</p>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}

function ActionBtn({ label }: { label: string }) {
    return (
        <button className="p-3 bg-gray-50 dark:bg-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 hover:text-orange-600 rounded-lg text-sm font-medium transition-all text-left">
            + {label}
        </button>
    );
}
