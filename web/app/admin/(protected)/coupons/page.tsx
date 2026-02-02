'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (Array.isArray(data)) setCoupons(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                loadCoupons();
            } else {
                alert('Failed to delete coupon');
            }
        } catch (error) {
            alert('Error deleting coupon');
        }
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: formData.get('code'),
                    discount_type: formData.get('discount_type'),
                    discount_value: formData.get('discount_value'),
                    expiry_date: formData.get('expiry_date') || null,
                    usage_limit: formData.get('usage_limit') || null
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setShowModal(false);
            loadCoupons();
            form.reset();
        } catch (error: any) {
            alert(error.message || 'Failed to create coupon');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Coupons</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                    + Create Coupon
                </button>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Coupon</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Code</label>
                                <input name="code" type="text" required placeholder="e.g. AYU20" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600 uppercase" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
                                    <select name="discount_type" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600">
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Value</label>
                                    <input name="discount_value" type="number" required min="1" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expiry Date (Optional)</label>
                                <input name="expiry_date" type="date" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Usage Limit (Optional)</label>
                                <input name="usage_limit" type="number" min="1" placeholder="Unlimited" className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-700 dark:border-zinc-600" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button disabled={isSubmitting} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">
                                    {isSubmitting ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                        {isLoading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading coupons...</td></tr>
                        ) : coupons.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No coupons active.</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                    <td className="p-4 font-mono font-bold text-orange-600">{coupon.code}</td>
                                    <td className="p-4 text-gray-900 dark:text-white">
                                        {coupon.discount_type === 'PERCENTAGE' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {coupon.usage_count} / {coupon.usage_limit || '∞'}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {coupon.expiry_date ? format(new Date(coupon.expiry_date), 'MMM d, yyyy') : 'Never'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
