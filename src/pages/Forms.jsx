import React from 'react';
import { useStorage } from '../context/StorageContext';
import { FileText, CheckCircle, Clock, MoreHorizontal } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

export const Forms = () => {
    const { forms, contacts } = useStorage();

    const enrichedForms = forms.map(f => ({
        ...f,
        contact: contacts.find(c => c.id === f.contactId) || { name: 'Unknown' }
    })).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Forms & Documents</h1>
                    <p className="text-[var(--color-text-secondary)]">Track intake forms and agreements.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                {enrichedForms.length === 0 ? (
                    <div className="p-12 text-center text-[var(--color-text-description)]">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No forms sent yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm">Form Name</th>
                                <th className="px-6 py-4 font-semibold text-sm">Sent To</th>
                                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm">Sent Date</th>
                                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {enrichedForms.map(form => (
                                <tr key={form.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{form.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{form.contact.name}</td>
                                    <td className="px-6 py-4">
                                        {form.status === 'completed' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle size={12} /> Completed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(form.sentAt)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
