'use client';

import { cn } from '@/lib/utils';

interface PricingToggleProps {
    isYearly: boolean;
    onToggle: (isYearly: boolean) => void;
    popColor?: string;
}

export default function PricingToggle({ isYearly, onToggle, popColor = '#000000' }: PricingToggleProps) {
    return (
        <div className="flex justify-center mb-12 mt-16">
            <div className="inline-flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                <button
                    onClick={() => onToggle(false)}
                    className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                        !isYearly ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                    )}
                    style={!isYearly ? { backgroundColor: popColor } : undefined}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onToggle(true)}
                    className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                        isYearly ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                    )}
                    style={isYearly ? { backgroundColor: popColor } : undefined}
                >
                    Yearly
                </button>
            </div>
        </div>
    );
} 