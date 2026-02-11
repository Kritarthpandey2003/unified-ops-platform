import React from 'react';
import { useStorage } from '../context/StorageContext';
import { Button } from '../components/ui/Button';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';
import { classNames } from '../lib/utils';

export const Inventory = () => {
    const { inventory, updateInventoryQuantity } = useStorage();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Inventory & Resources</h1>
                    <p className="text-[var(--color-text-secondary)]">Track items and set low-stock alerts.</p>
                </div>
                <Button>+ Add Item</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-secondary)]">Item Name</th>
                            <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-secondary)]">Status</th>
                            <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-secondary)] text-center">Quantity</th>
                            <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-secondary)]">Threshold</th>
                            <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-secondary)] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {inventory.map(item => {
                            const isLow = item.quantity <= item.threshold;
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded bg-gray-100 text-gray-500">
                                                <Package size={18} />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isLow ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <AlertTriangle size={12} /> Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => updateInventoryQuantity(item.id, -1)}
                                                className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={classNames("font-mono font-medium w-8 text-center", isLow ? "text-red-600" : "text-gray-900")}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateInventoryQuantity(item.id, 1)}
                                                className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {item.threshold} units
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
