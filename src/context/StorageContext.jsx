import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../lib/utils';
import { addDays, subHours } from 'date-fns';

const StorageContext = createContext();

export const useStorage = () => useContext(StorageContext);

const INITIAL_WORKSPACE = {
    name: '',
    timezone: '',
    channels: { email: false, sms: false },
    setupStep: 0, // 0 to 8
    activated: false,
};

const SEED_INVENTORY = [
    { id: 'inv-1', name: 'Consultation Room A', quantity: 1, threshold: 1 },
    { id: 'inv-2', name: 'Repair Parts Kit', quantity: 15, threshold: 5 },
    { id: 'inv-3', name: 'Welcome Pack', quantity: 3, threshold: 5 }, // Low stock example
];

export const StorageProvider = ({ children }) => {
    const [workspace, setWorkspace] = useLocalStorage('ops_workspace', INITIAL_WORKSPACE);
    const [contacts, setContacts] = useLocalStorage('ops_contacts', []);
    const [bookings, setBookings] = useLocalStorage('ops_bookings', []);
    const [messages, setMessages] = useLocalStorage('ops_messages', []);
    const [inventory, setInventory] = useLocalStorage('ops_inventory', []);
    const [forms, setForms] = useLocalStorage('ops_forms', []);
    const [userRole, setUserRole] = useLocalStorage('ops_user_role', 'owner'); // 'owner' | 'staff'

    // Seed Data Trigger
    useEffect(() => {
        if (inventory.length === 0) {
            setInventory(SEED_INVENTORY);
        }
    }, []);

    // --- ACTIONS ---

    const updateWorkspace = (updates) => setWorkspace(prev => ({ ...prev, ...updates }));

    const addContact = (contact) => {
        const newContact = { id: generateId(), createdAt: new Date().toISOString(), ...contact };
        setContacts(prev => [newContact, ...prev]);
        return newContact;
    };

    const addBooking = (booking) => {
        const newBooking = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: 'confirmed',
            formStatus: 'pending',
            ...booking
        };
        setBookings(prev => [...prev, newBooking]);
        return newBooking;
    };

    const addMessage = (msg) => {
        const newMsg = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            read: false,
            ...msg
        };
        setMessages(prev => [...prev, newMsg]);
        return newMsg;
    };

    const addForm = (formData) => {
        const newForm = {
            id: generateId(),
            status: 'pending', // pending | completed
            sentAt: new Date().toISOString(),
            ...formData
        };
        setForms(prev => [...prev, newForm]);
        return newForm;
    };

    const updateInventoryQuantity = (id, delta) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }));
    };

    return (
        <StorageContext.Provider value={{
            workspace, updateWorkspace,
            contacts, addContact,
            bookings, addBooking,
            messages, addMessage,
            forms, addForm,
            inventory, updateInventoryQuantity,
            userRole, setUserRole
        }}>
            {children}
        </StorageContext.Provider>
    );
};
