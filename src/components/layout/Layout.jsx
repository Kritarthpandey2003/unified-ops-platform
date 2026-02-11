import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStorage } from '../../context/StorageContext';
import {
    LayoutDashboard,
    Inbox,
    Calendar,
    Files,
    Package,
    Users,
    Settings,
    LogOut
} from 'lucide-react';

export const Layout = () => {
    const { workspace, userRole, setUserRole } = useStorage();
    const location = useLocation();

    if (!workspace.activated && location.pathname !== '/onboarding') {
        // Redirect logic handled in App.jsx usually, but here for safety visual
        return <div className="p-10 text-center">Please complete onboarding first.</div>;
    }

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/inbox', icon: Inbox, label: 'Inbox' },
        { to: '/bookings', icon: Calendar, label: 'Bookings' },
        { to: '/forms', icon: Files, label: 'Forms' },
        { to: '/inventory', icon: Package, label: 'Inventory' },
    ];

    if (userRole === 'owner') {
        navItems.push({ to: '/staff', icon: Users, label: 'Staff' });
        navItems.push({ to: '/settings', icon: Settings, label: 'Settings' });
    }

    return (
        <div className="flex h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[var(--color-border)] flex flex-col">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h1 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
                        {workspace.name || 'Unified Ops'}
                    </h1>
                    <div className="mt-2 text-xs font-medium px-2 py-1 bg-[var(--color-bg-base)] rounded-md inline-block text-[var(--color-text-secondary)]">
                        {workspace.activated ? 'Active Workspace' : 'Setup Mode'}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)] hover:text-[var(--color-text-primary)]'}
              `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Role Switcher */}
                <div className="p-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
                            {userRole === 'owner' ? 'OW' : 'ST'}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{userRole === 'owner' ? 'Business Owner' : 'Staff Member'}</p>
                            <button
                                onClick={() => setUserRole(userRole === 'owner' ? 'staff' : 'owner')}
                                className="text-xs text-[var(--color-accent)] hover:underline"
                            >
                                Switch to {userRole === 'owner' ? 'Staff' : 'Owner'}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold capitalize">
                        {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
                    </h2>
                    <div className="flex items-center gap-4">
                        {/* Bell Icon or similar could go here */}
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
