'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { use } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle, Save, Loader2, ListChecks } from 'lucide-react';
import Link from 'next/link';

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string | null;
    option_d: string | null;
    correct_option: string;
    explanation: string | null;
    order_index: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    type: string;
    passing_percentage: number;
    time_limit_minutes: number | null;
}

export default function QuizDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // New Question Form
    const [newQ, setNewQ] = useState({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        explanation: '',
        order_index: 10
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch Quiz
            const resQuiz = await fetch(`/api/quizzes/${id}`);
            const dataQuiz = await resQuiz.json();
            setQuiz(dataQuiz);

            // Fetch Questions (Using specific questions API or separate call)
            // Note: Our generic /api/questions takes quizId param
            const resQuestions = await fetch(`/api/questions?quizId=${id}`);
            const dataQuestions = await resQuestions.json();
            if (Array.isArray(dataQuestions)) {
                setQuestions(dataQuestions);
                setNewQ(p => ({ ...p, order_index: (dataQuestions.length + 1) * 10 }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quiz_id: id,
                    ...newQ,
                    option_c: newQ.option_c || null,
                    option_d: newQ.option_d || null,
                    explanation: newQ.explanation || null
                })
            });

            if (res.ok) {
                setShowAddForm(false);
                setNewQ({
                    question_text: '',
                    option_a: '',
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    correct_option: 'A',
                    explanation: '',
                    order_index: questions.length * 10 + 20
                });
                loadData(); // Reload list
            } else {
                alert('Error adding question');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading details...</div>;
    if (!quiz) return <div className="p-12 text-center text-red-500">Quiz not found</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/quizzes"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">{quiz.title}</h1>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs font-semibold">
                            {quiz.type}
                        </span>
                        <span>Pass: {quiz.passing_percentage}%</span>
                        {quiz.time_limit_minutes && <span>Time: {quiz.time_limit_minutes}m</span>}
                        <span>{questions.length} Questions</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Questions List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
                            <ListChecks size={20} />
                            Questions
                        </h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="text-sm bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <Plus size={16} />
                            Add Question
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border-2 border-green-500/20 mb-8 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-semibold mb-4 dark:text-white">New Question</h3>
                            <form onSubmit={handleAddQuestion} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Question Text</label>
                                    <textarea
                                        required
                                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        rows={2}
                                        value={newQ.question_text}
                                        onChange={e => setNewQ({ ...newQ, question_text: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {['a', 'b', 'c', 'd'].map((opt) => (
                                        <div key={opt}>
                                            <label className="block text-xs font-medium uppercase text-gray-500 mb-1 flex justify-between">
                                                Option {opt.toUpperCase()}
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={newQ.correct_option === opt.toUpperCase()}
                                                    onChange={() => setNewQ({ ...newQ, correct_option: opt.toUpperCase() })}
                                                    className="accent-green-600 cursor-pointer"
                                                />
                                            </label>
                                            <input
                                                type="text"
                                                required={['a', 'b'].includes(opt)}
                                                className={`w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white ${newQ.correct_option === opt.toUpperCase() ? 'border-green-500 ring-1 ring-green-500' : ''
                                                    }`}
                                                value={(newQ as any)[`option_${opt}`]}
                                                onChange={e => setNewQ({ ...newQ, [`option_${opt}`]: e.target.value })}
                                                placeholder={['c', 'd'].includes(opt) ? "(Optional)" : "Required"}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Explanation (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                        value={newQ.explanation}
                                        onChange={e => setNewQ({ ...newQ, explanation: e.target.value })}
                                        placeholder="Explain the answer..."
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <Save size={18} /> Save Question
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-3">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-green-500/30 transition-colors">
                                <div className="flex gap-4">
                                    <span className="text-gray-400 font-mono text-sm w-6 pt-1">Q{idx + 1}.</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white mb-3">{q.question_text}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                            <OptionView label="A" text={q.option_a} isCorrect={q.correct_option === 'A'} />
                                            <OptionView label="B" text={q.option_b} isCorrect={q.correct_option === 'B'} />
                                            {q.option_c && <OptionView label="C" text={q.option_c} isCorrect={q.correct_option === 'C'} />}
                                            {q.option_d && <OptionView label="D" text={q.option_d} isCorrect={q.correct_option === 'D'} />}
                                        </div>
                                        {q.explanation && (
                                            <div className="mt-3 text-xs text-gray-500 bg-gray-50 dark:bg-zinc-700/50 p-2 rounded">
                                                <span className="font-semibold">Explanation:</span> {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                    {/* Actions like Edit/Delete could go here */}
                                </div>
                            </div>
                        ))}
                        {questions.length === 0 && !showAddForm && (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-dashed">
                                No questions added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700">
                        <h3 className="font-semibold mb-4 dark:text-white">Details</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="text-gray-500 block text-xs uppercase">Description</label>
                                <p className="dark:text-gray-300">{quiz.description || 'No description'}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 block text-xs uppercase">Created At</label>
                                <p className="dark:text-gray-300">Today</p> {/* Todo: formatted date */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OptionView({ label, text, isCorrect }: { label: string, text: string, isCorrect: boolean }) {
    return (
        <div className={`p-2 rounded border flex items-start gap-2 ${isCorrect
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                : 'border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-400'
            }`}>
            <span className={`font-bold w-5 h-5 flex items-center justify-center rounded text-xs ${isCorrect ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-100 dark:bg-zinc-700'
                }`}>{label}</span>
            <span className="break-words flex-1 leading-tight">{text}</span>
            {isCorrect && <CheckCircle size={14} className="shrink-0 mt-0.5" />}
        </div>
    );
}
