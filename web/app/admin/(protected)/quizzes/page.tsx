'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Brain, GraduationCap, MonitorPlay } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Quiz {
    id: string;
    title: string;
    type: 'VIDEO' | 'MODULE' | 'SUBJECT' | 'MOCK';
    _count: {
        questions: number;
    };
    created_at: string;
}

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('ALL');
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, [filterType]);

    const loadData = async () => {
        setLoading(true);
        try {
            let url = '/api/quizzes';
            if (filterType !== 'ALL') {
                url += `?type=${filterType}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuizzes(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'MOCK': return <Brain className="text-purple-500" />;
            case 'SUBJECT': return <GraduationCap className="text-blue-500" />;
            case 'MODULE': return <FileText className="text-orange-500" />;
            default: return <MonitorPlay className="text-green-500" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'MOCK': return 'Mock Test';
            case 'SUBJECT': return 'Subject Test';
            case 'MODULE': return 'Module Quiz';
            default: return 'Video Quiz';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Quizzes & Mock Tests</h1>
                <Link
                    href="/admin/quizzes/create"
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus size={20} />
                    Create New Test
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg w-fit">
                {['ALL', 'MOCK', 'SUBJECT', 'MODULE', 'VIDEO'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterType === type
                                ? 'bg-white dark:bg-zinc-700 shadow text-gray-900 dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        {type === 'ALL' ? 'All Tests' : getTypeLabel(type)}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : quizzes.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
                    <Brain className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No tests found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz or mock test.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/admin/quizzes/${quiz.id}`)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-zinc-700 rounded-full">
                                    {getTypeIcon(quiz.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                            {getTypeLabel(quiz.type)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                            {quiz._count.questions} Questions
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                            {new Date(quiz.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-gray-400 hover:text-gray-600">
                                <CommonArrowRight />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CommonArrowRight() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
