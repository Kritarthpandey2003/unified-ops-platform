import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import { Button } from '../components/ui/Button';
import { Check, ChevronRight, Building, MessageSquare, Calendar } from 'lucide-react';

export const Onboarding = () => {
    const { workspace, updateWorkspace } = useStorage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        timezone: 'UTC',
        emailChannel: true,
        smsChannel: false,
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Finalize setup
            updateWorkspace({
                name: formData.name,
                timezone: formData.timezone,
                channels: { email: formData.emailChannel, sms: formData.smsChannel },
                activated: true,
            });
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden">

                {/* Header */}
                <div className="bg-[var(--color-primary)] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold mb-2">Welcome to Unified Ops</h1>
                        <p className="opacity-90">Let's set up your business command center.</p>
                    </div>

                    <div className="flex items-center gap-2 mt-8 relative z-10">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-[var(--color-accent)]' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 min-h-[400px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center border border-blue-100">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Business Details</h2>
                                    <p className="text-[var(--color-text-secondary)]">Tell us about your organization.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Business Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                                        placeholder="e.g. Acme Services"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Location (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                                        placeholder="e.g. 123 Main St, New York"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Timezone</label>
                                    <select
                                        className="w-full p-2.5 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white"
                                        value={formData.timezone}
                                        onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                                    >
                                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                                        <option value="EST">EST (New York)</option>
                                        <option value="PST">PST (Los Angeles)</option>
                                        <option value="IST">IST (India Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Communication Channels</h2>
                                    <p className="text-[var(--color-text-secondary)]">Where should customers reach you?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all hover:border-[var(--color-accent)] ${formData.emailChannel ? 'border-[var(--color-primary)] bg-blue-50/50 ring-1 ring-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                                            checked={formData.emailChannel}
                                            onChange={e => setFormData({ ...formData, emailChannel: e.target.checked })}
                                        />
                                        <div>
                                            <span className="font-semibold block text-[var(--color-text-primary)]">Email Integration</span>
                                            <span className="text-sm text-[var(--color-text-secondary)]">Send quotes, invoices, and updates via email.</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-all hover:border-[var(--color-accent)] ${formData.smsChannel ? 'border-[var(--color-primary)] bg-blue-50/50 ring-1 ring-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                                            checked={formData.smsChannel}
                                            onChange={e => setFormData({ ...formData, smsChannel: e.target.checked })}
                                        />
                                        <div>
                                            <span className="font-semibold block text-[var(--color-text-primary)]">SMS Integration</span>
                                            <span className="text-sm text-[var(--color-text-secondary)]">Send instant booking reminders and urgent alerts.</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Ready to Launch</h2>
                                    <p className="text-[var(--color-text-secondary)]">We're generating your dashboard environment.</p>
                                </div>
                            </div>

                            <div className="bg-[var(--color-bg-base)] p-6 rounded-lg border border-[var(--color-border)] space-y-4 text-sm">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                    <span className="text-[var(--color-text-secondary)]">Workspace</span>
                                    <span className="font-medium text-lg">{formData.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--color-text-secondary)]">Timezone</span>
                                    <span className="font-medium font-mono bg-white px-2 py-1 rounded border">{formData.timezone}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--color-text-secondary)]">Active Channels</span>
                                    <div className="flex gap-2">
                                        {formData.emailChannel && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Email</span>}
                                        {formData.smsChannel && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">SMS</span>}
                                        {!formData.emailChannel && !formData.smsChannel && <span className="text-[var(--color-danger)] font-medium">None Selected</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-800 text-sm rounded-md border border-orange-100">
                                <div className="mt-0.5">⚠️</div>
                                <p>
                                    <strong>Prototype Mode:</strong> Clicking "Activate Workspace" will initialize the browser-based database with sample inventory and booking data for demonstration purposes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--color-border)] flex justify-between bg-gray-50">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className="text-[var(--color-text-secondary)]"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={step === 1 && !formData.name}
                        className="shadow-md hover:shadow-lg transition-shadow"
                    >
                        {step === 3 ? 'Activate Workspace' : 'Continue'}
                        {step !== 3 && <ChevronRight size={16} className="ml-2" />}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Onboarding;
