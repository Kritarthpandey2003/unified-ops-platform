import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, Clock, User, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { formatDateTime, classNames } from '../lib/utils';
import { format } from 'date-fns';

export const Bookings = () => {
    const { bookings, contacts, updateBooking } = useStorage();
    const [filter, setFilter] = useState('upcoming'); // upcoming | past | all

    // Enrich bookings with Contact data
    const enrichedBookings = bookings.map(b => ({
        ...b,
        contact: contacts.find(c => c.id === b.contactId) || { name: 'Unknown' }
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const filteredBookings = enrichedBookings.filter(b => {
        const isPast = new Date(b.date) < new Date();
        if (filter === 'upcoming') return !isPast;
        if (filter === 'past') return isPast;
        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Bookings</h1>
                    <p className="text-[var(--color-text-secondary)]">Manage appointments and schedules.</p>
                </div>
                <Button>+ Manual Booking</Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 border-b border-[var(--color-border)] pb-1">
                {['upcoming', 'past', 'all'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={classNames(
                            "px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors",
                            filter === f ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List View */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-[var(--color-border)] text-[var(--color-text-description)]">
                        <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No {filter} bookings found.</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded-lg border border-[var(--color-border)] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">

                            <div className="flex items-center gap-6">
                                {/* Date Box */}
                                <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-lg border border-[var(--color-border)]">
                                    <span className="text-xs font-bold text-[var(--color-accent)] uppercase">{format(new Date(booking.date), 'MMM')}</span>
                                    <span className="text-xl font-bold text-[var(--color-text-primary)]">{format(new Date(booking.date), 'd')}</span>
                                </div>

                                {/* Details */}
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-1">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {format(new Date(booking.date), 'h:mm a')} ({booking.duration}m)</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {booking.contact.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Status */}
                            <div className="flex items-center gap-4">
                                {booking.status === 'confirmed' ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                        <CheckCircle size={12} /> Confirmed
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
                                        {booking.status}
                                    </span>
                                )}
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
