import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { addDays, format, startOfHour, addHours } from 'date-fns';

export const PublicBooking = () => {
    const { addBooking, addContact, addMessage, addForm } = useStorage();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
    const [submitted, setSubmitted] = useState(false);

    // Mock Services
    const services = [
        { id: 'srv-1', name: 'Consultation', duration: 60, price: 100 },
        { id: 'srv-2', name: 'Service Repair', duration: 120, price: 250 },
        { id: 'srv-3', name: 'Installation', duration: 180, price: 400 },
    ];

    // Mock Available Slots (Next 3 days)
    const generateSlots = () => {
        const slots = [];
        const today = startOfHour(new Date());
        for (let i = 1; i <= 3; i++) {
            const d = addDays(today, i);
            // 9 AM, 1 PM, 4 PM slots
            slots.push(addHours(d, 9));
            slots.push(addHours(d, 13));
            slots.push(addHours(d, 16));
        }
        return slots;
    };
    const availableSlots = generateSlots();

    const handleBooking = (e) => {
        e.preventDefault();

        // 1. Create/Find Contact
        const contact = addContact({
            name: formData.name,
            email: formData.email,
        });

        // 2. Create Booking
        const booking = addBooking({
            contactId: contact.id,
            serviceId: selectedService.id,
            serviceName: selectedService.name, // Denormalized for prototype
            date: selectedTime.toISOString(),
            duration: selectedService.duration,
            notes: formData.notes,
        });

        // 3. Automation: Send Confirmation & Forms
        setTimeout(() => {
            addMessage({
                contactId: contact.id,
                direction: 'outbound',
                content: `Booking Confirmed for ${selectedService.name} on ${format(selectedTime, 'PP p')}. Please reply if you need to reschedule.`,
                type: 'email',
                automated: true,
            });

            // Create Form Record
            addForm({
                contactId: contact.id,
                title: 'Client Intake Form',
                relatedBookingId: booking.id
            });

            // Simulate Form Request
            addMessage({
                contactId: contact.id,
                direction: 'outbound',
                content: `Please complete your intake form here: [Link]`,
                type: 'email',
                automated: true,
            });
        }, 500);

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full animate-fadeIn">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Booking Confirmed!</h2>
                    <p className="text-[var(--color-text-secondary)]">We've sent a confirmation email to {formData.email}.</p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-sm">
                        <p><strong>Service:</strong> {selectedService.name}</p>
                        <p><strong>Time:</strong> {format(selectedTime, 'PPPP')} at {format(selectedTime, 'p')}</p>
                    </div>
                    <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
                        Book Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg border border-[var(--color-border)] max-w-4xl w-full flex overflow-hidden min-h-[500px]">
                {/* Sidebar Summary */}
                <div className="w-1/3 bg-gray-50 p-8 border-r border-[var(--color-border)] hidden md:block">
                    <h2 className="text-lg font-bold text-[var(--color-primary)] mb-6">Your Booking</h2>
                    {selectedService && (
                        <div className="mb-4">
                            <p className="text-xs uppercase text-gray-400 font-bold">Service</p>
                            <p className="font-medium">{selectedService.name}</p>
                            <p className="text-sm text-gray-500">{selectedService.duration} mins • ${selectedService.price}</p>
                        </div>
                    )}
                    {selectedTime && (
                        <div className="mb-4">
                            <p className="text-xs uppercase text-gray-400 font-bold">Date & Time</p>
                            <p className="font-medium">{format(selectedTime, 'MMM d, yyyy')}</p>
                            <p className="text-sm text-gray-500">{format(selectedTime, 'h:mm a')}</p>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h1 className="text-2xl font-bold">Select a Service</h1>
                            <div className="grid gap-4">
                                {services.map(srv => (
                                    <div
                                        key={srv.id}
                                        onClick={() => { setSelectedService(srv); setStep(2); }}
                                        className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold">{srv.name}</h3>
                                            <p className="text-sm text-gray-500">{srv.duration} mins</p>
                                        </div>
                                        <span className="font-medium text-[var(--color-primary)]">${srv.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="pl-0 hover:bg-transparent">← Back</Button>
                            </div>
                            <h1 className="text-2xl font-bold">Select a Time</h1>
                            <div className="grid grid-cols-2 gap-3">
                                {availableSlots.map((slot, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSelectedTime(slot); setStep(3); }}
                                        className="p-3 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors text-sm font-medium"
                                    >
                                        {format(slot, 'EEE, MMM d')} <br />
                                        <span className="text-lg">{format(slot, 'h:mm a')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="pl-0 hover:bg-transparent">← Back</Button>
                            </div>
                            <h1 className="text-2xl font-bold">Enter Details</h1>
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-2 border border-[var(--color-border)] rounded-md"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full p-2 border border-[var(--color-border)] rounded-md"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                                    <textarea
                                        className="w-full p-2 border border-[var(--color-border)] rounded-md resize-none"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full" size="lg">Confirm Booking</Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
