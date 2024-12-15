'use client';

import SectionTitle from '@/components/ui/SectionTitle';
import { BsCheckLg, BsX } from 'react-icons/bs';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import PricingToggle from './PricingToggle';
import { useState } from 'react';

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  description: string;
  yearly: string;
  monthly: string;
  features: string[];
}

const defaultPlans: PricingPlan[] = [
    {
        name: "Basic plan",
        description: "Lorem ipsum dolor sit amet",
        yearly: "$190",
        monthly: "$19",
        features: [
            "Basic feature 1",
            "Basic feature 2",
            "Basic feature 3"
        ]
    },
    {
        name: "Business plan",
        description: "Lorem ipsum dolor sit amet",
        yearly: "$990",
        monthly: "$99",
        features: [
            "Basic feature 1",
            "Basic feature 2",
            "Basic feature 3",
            "Premium feature 1",
            "Premium feature 2",
            "Premium feature 3"
        ]
    }
];

interface PricingComponentProps {
    tagline?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    backgroundColor?: string;
    popColor?: string;
    buttonHref?: string;
    plans?: PricingPlan[];
    compare?: boolean;
}

const calculateSavings = (monthly: string, yearly: string): number => {
    const monthlyNum = parseFloat(monthly.replace('$', ''));
    const yearlyNum = parseFloat(yearly.replace('$', ''));
    const yearlyIfMonthly = monthlyNum * 12;
    const savings = 1 - (yearlyNum / yearlyIfMonthly);
    return Math.round(savings * 100);
};

export default function PricingComponent({
    tagline = 'PRICING',
    title = 'Plans & Pricing',
    description = 'Choose the plan that best suits your needs.',
    buttonText = 'Get started',
    backgroundColor = '#f6f7f9',
    buttonHref = '#',
    popColor = 'hsl(120 , 100% , 20%)',
    plans = defaultPlans,
    compare = true,
}: PricingComponentProps) {
    const [isYearly, setIsYearly] = useState(false);

    // Find the plan with the most features
    const maxFeatures = Math.max(...plans.map(plan => plan.features.length));

    // For each plan, we'll show all features up to maxFeatures
    const getFeaturesToShow = (planFeatures: string[], allPlansFeatures: string[]) => {
        return allPlansFeatures.slice(0, maxFeatures).map(feature => ({
            text: feature,
            included: planFeatures.includes(feature)
        }));
    };

    // Get all features in order (maintaining order from highest tier plan)
    const allOrderedFeatures = compare 
        ? plans[plans.length - 1].features
        : [];

    return (
        <section 
            className="w-full min-h-screen lg:h-screen overflow-y-auto" 
            style={{ backgroundColor }}
            role="region"
            aria-label="Pricing Plans"
        >
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <SectionTitle 
                    tagline={tagline}
                    title={title}
                    description={description}
                    popColor={popColor}
                />
                
                <PricingToggle isYearly={isYearly} onToggle={setIsYearly} popColor={popColor} />

                {/* Pricing Cards */}
                <div 
                    className="grid lg:grid-cols-2 gap-4 lg:gap-6"
                    role="list"
                    aria-label="Available pricing plans"
                >
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className="relative bg-white rounded-md border border-gray-900 p-8 lg:p-10 flex flex-col"
                            role="listitem"
                            aria-label={`${plan.name} pricing plan`}
                        >
                            <div className="mb-8">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <div className="text-right relative">
                                        <div className="flex items-baseline" aria-label={`${isYearly ? 'Yearly' : 'Monthly'} price`}>
                                            <span className="text-4xl font-bold text-gray-900">
                                                {isYearly ? plan.yearly : plan.monthly}
                                            </span>
                                            <span className="text-gray-900 ml-1 text-base">/{isYearly ? 'yr' : 'mo'}</span>
                                        </div>
                                        {isYearly && (
                                            <div 
                                                className="absolute top-full right-0 text-sm text-gray-600 whitespace-nowrap"
                                                aria-label={`Save ${calculateSavings(plan.monthly, plan.yearly)}% with yearly billing`}
                                            >
                                                Save {calculateSavings(plan.monthly, plan.yearly)}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-900">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="h-px bg-black w-full mb-6" />
                                <div className="space-y-4">
                                    <p className="font-medium text-gray-900">Includes:</p>
                                    <div 
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        role="list"
                                        aria-label={`Features included in ${plan.name}`}
                                    >
                                        {compare 
                                            ? getFeaturesToShow(plan.features, allOrderedFeatures).map((feature, featureIndex) => (
                                                <div 
                                                    key={featureIndex} 
                                                    className="flex items-center"
                                                    role="listitem"
                                                >
                                                    {feature.included ? (
                                                        <BsCheckLg 
                                                            className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <BsX 
                                                            className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <span 
                                                        className={`${feature.included ? 'text-gray-900' : 'text-gray-500'}`}
                                                        aria-label={`${feature.included ? 'Included' : 'Not included'}: ${feature.text}`}
                                                    >
                                                        {feature.text}
                                                    </span>
                                                </div>
                                            ))
                                            : plan.features.map((feature, featureIndex) => (
                                                <div 
                                                    key={featureIndex} 
                                                    className="flex items-center"
                                                    role="listitem"
                                                >
                                                    <BsCheckLg 
                                                        className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-gray-900">{feature}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <ProgressiveButton
                                    href={buttonHref}
                                    variant="default"
                                    size="lg"
                                    className="w-full rounded-sm"
                                    style={{ backgroundColor: popColor }}
                                    hoverEffect="reveal-arrow"
                                    aria-label={`Get started with ${plan.name}`}
                                >
                                    {buttonText}
                                </ProgressiveButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
