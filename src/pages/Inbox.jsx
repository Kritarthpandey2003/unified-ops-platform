import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import { Button } from '../components/ui/Button';
import { User, Send, Clock, CheckCheck } from 'lucide-react';
import { formatDateTime, classNames } from '../lib/utils';

export const Inbox = () => {
    const { messages, contacts, addMessage, workspace } = useStorage();
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Group messages by Contact
    // 1. Get unique contact IDs from messages
    const activeContactIds = [...new Set(messages.map(m => m.contactId))];

    // 2. Map to contact details and last message
    const conversations = activeContactIds.map(id => {
        const contact = contacts.find(c => c.id === id) || { name: 'Unknown', email: 'No Email' };
        const contactMessages = messages.filter(m => m.contactId === id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return {
            contact,
            lastMessage: contactMessages[0],
            messages: contactMessages.reverse(), // For chat view (oldest first)
        };
    }).sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

    const activeConversation = selectedContactId ? conversations.find(c => c.contact.id === selectedContactId) : null;

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedContactId) return;

        addMessage({
            contactId: selectedContactId,
            direction: 'outbound',
            content: replyText,
            type: 'email',
        });

        setReplyText('');
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">

            {/* Sidebar List */}
            <div className="w-80 border-r border-[var(--color-border)] flex flex-col">
                <div className="p-4 border-b border-[var(--color-border)] bg-gray-50">
                    <h2 className="font-semibold text-lg">Inbox</h2>
                    <p className="text-xs text-[var(--color-text-secondary)]">{activeContactIds.length} Conversations</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-[var(--color-text-description)]">
                            No conversations yet.
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.contact.id}
                                onClick={() => setSelectedContactId(conv.contact.id)}
                                className={classNames(
                                    "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                                    selectedContactId === conv.contact.id ? "bg-blue-50/50 border-l-4 border-l-[var(--color-primary)]" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm truncate">{conv.contact.name}</span>
                                    <span className="text-xs text-[var(--color-text-description)] whitespace-nowrap">
                                        {formatDateTime(conv.lastMessage.timestamp).split(',')[0]}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                                    {conv.lastMessage.direction === 'outbound' && <span className="mr-1">You:</span>}
                                    {conv.lastMessage.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-[var(--color-bg-base)]">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-[var(--color-border)] bg-white px-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{activeConversation.contact.name}</h3>
                                    <p className="text-xs text-[var(--color-text-secondary)]">{activeConversation.contact.email}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline">View Contact</Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeConversation.messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={classNames(
                                        "flex flex-col max-w-[70%]",
                                        msg.direction === 'outbound' ? "self-end items-end" : "self-start items-start"
                                    )}
                                >
                                    <div className={classNames(
                                        "p-4 rounded-lg text-sm shadow-sm",
                                        msg.direction === 'outbound'
                                            ? "bg-[var(--color-primary)] text-white rounded-br-none"
                                            : "bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1">
                                        <span className="text-[10px] text-gray-400">{formatDateTime(msg.timestamp)}</span>
                                        {msg.automated && <span className="text-[10px] text-[var(--color-accent)] font-medium bg-blue-50 px-1 rounded">Auto</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Area */}
                        <div className="p-4 bg-white border-t border-[var(--color-border)]">
                            <form onSubmit={handleSendReply} className="flex gap-4">
                                <input
                                    type="text"
                                    className="flex-1 p-3 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                />
                                <Button type="submit" disabled={!replyText.trim()}>
                                    <Send size={18} className="mr-2" />
                                    Send
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-description)]">
                        <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                            <Clock size={48} className="text-gray-300" />
                        </div>
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Manage all your customer messages in one place.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Inbox;
