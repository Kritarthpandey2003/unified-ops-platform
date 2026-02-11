import { v4 as uuidv4 } from 'uuid';
import { format, formatDistanceToNow } from 'date-fns';

export const generateId = () => uuidv4();

export const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, h:mm a');
};

export const formatRelativeTime = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
