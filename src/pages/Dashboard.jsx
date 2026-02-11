import React from 'react';
import { useStorage } from '../context/StorageContext';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, AlertTriangle, CheckCircle, Package, FileText } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const Dashboard = () => {
    const { workspace, bookings, messages, inventory, forms, userRole } = useStorage();

    // Metrics
    const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);
    const unreadMessages = messages.filter(m => !m.read);
    const pendingForms = forms.filter(f => f.status === 'pending');
    const todaysBookings = bookings.filter(b => {
        const d = new Date(b.date);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    });

    return (
        <div className="space-y-6">
            {/* Welcome / Role Context */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                        {userRole === 'owner' ? `Overview for ${workspace.name}` : `Hello, Staff Member`}
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">Here's what's happening right now.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open('/book-now', '_blank')}>View Live Booking</Button>
                    <Button size="sm" onClick={() => window.open('/book-now', '_blank')}>+ New Booking</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-[var(--color-primary)]">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1 rounded">Today</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{todaysBookings.length}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Bookings</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <ArrowUpRight size={20} />
                        </div>
                        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1 rounded">Inbox</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{unreadMessages.length}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Unread</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <FileText size={20} />
                        </div>
                        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1 rounded">Action</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{pendingForms.length}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Pending Forms</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${lowStockItems.length > 0 ? 'bg-red-50 text-[var(--color-danger)]' : 'bg-green-50 text-green-600'}`}>
                            <Package size={20} />
                        </div>
                        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1 rounded">Inventory</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--color-text-primary)]">{lowStockItems.length}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Items low on stock</p>
                </div>
            </div>

            {/* Alerts Section (Critical) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Urgent Attention */}
                <div className="bg-white rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col">
                    <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <AlertTriangle size={18} className="text-[var(--color-warning)]" />
                            Requires Attention
                        </h3>
                    </div>
                    <div className="p-6 flex-1">
                        {lowStockItems.length === 0 && unreadMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-description)]">
                                <CheckCircle size={48} className="mb-4 opacity-20" />
                                <p>All systems operational.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <Package size={16} className="text-[var(--color-danger)]" />
                                            <span className="text-sm font-medium text-red-900">Low Stock: {item.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-[var(--color-danger)]">{item.quantity} left</span>
                                    </div>
                                ))}
                                {unreadMessages.map(msg => (
                                    <div key={msg.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                                        <span className="text-sm font-medium text-blue-900">New Message from Client</span>
                                        <span className="text-xs text-blue-700">Just now</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-[var(--color-border)] rounded-b-xl text-center">
                        <Button variant="ghost" size="sm" className="w-full">View All Alerts</Button>
                    </div>
                </div>

                {/* Recent Activity / Schedule */}
                <div className="bg-white rounded-xl shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col">
                    <div className="p-6 border-b border-[var(--color-border)]">
                        <h3 className="font-semibold text-lg">Today's Schedule</h3>
                    </div>
                    <div className="p-6 flex-1">
                        {todaysBookings.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-description)]">
                                <p>No bookings for today.</p>
                                <Button variant="outline" size="sm" className="mt-4">Add Walk-in</Button>
                            </div>
                        ) : (
                            <ul>{/* Map bookings */}</ul>
                        )}
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Dashboard;
