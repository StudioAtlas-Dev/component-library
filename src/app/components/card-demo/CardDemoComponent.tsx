import FeaturedCard from "@/components/ui/FeaturedCard";

const cards = [
    {
        title: "Gym Training",
        description: "Professional training programs to help you achieve your fitness goals.",
        imageUrl: "/images/gym-hero.jpg",
        href: "/components/gym-hero-section"
    },
    {
        title: "Personal Training",
        description: "One-on-one sessions with expert trainers for personalized guidance.",
        imageUrl: "/images/gym-instructor.jpg",
        href: "/components/personal-training"
    },
    {
        title: "Join Our Community",
        description: "Be part of a supportive community that helps you stay motivated.",
        imageUrl: "/images/gym-join.jpg"
    },
    {
        title: "Design Excellence",
        description: "Create stunning visuals that capture attention and inspire.",
        imageUrl: "/images/design-hero.jpg",
        href: "/components/design-section"
    }
];

export default function CardDemoComponent() {
    return (
        <section className="w-full py-8 sm:py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {cards.map((card, index) => (
                        <FeaturedCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            imageUrl={card.imageUrl}
                            href={card.href}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 