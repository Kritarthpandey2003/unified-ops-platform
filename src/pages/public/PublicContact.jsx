import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export const PublicContact = () => {
    const { addContact, addMessage } = useStorage();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate Network Delay
        setTimeout(() => {
            // 1. Create Contact
            const contact = addContact({
                name: form.name,
                email: form.email,
                phone: '',
            });

            // 2. Create Inbound Message
            addMessage({
                contactId: contact.id,
                direction: 'inbound',
                content: form.message,
                type: 'email', // or 'sms' logic
            });

            // 3. (Automation) Send Welcome Message
            // In a real backend, this happens via event bus. Here we simulate it.
            setTimeout(() => {
                addMessage({
                    contactId: contact.id,
                    direction: 'outbound',
                    content: "Hi there! Thanks for reaching out. We'll get back to you shortly.",
                    type: 'email',
                    automated: true,
                });
            }, 1000);

            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full animate-fadeIn">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Message Sent!</h2>
                    <p className="text-[var(--color-text-secondary)]">Thanks for contacting us. We've received your inquiry and will respond shortly.</p>
                    <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}>
                        Send Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-[var(--color-border)] max-w-lg w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">Contact Us</h1>
                    <p className="text-[var(--color-text-secondary)]">We'd love to hear from you. Send us a message!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Your Name</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full p-3 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full p-3 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                            placeholder="How can we help you?"
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Send Message
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    Powered by Unified Ops
                </div>
            </div>
        </div>
    );
};
