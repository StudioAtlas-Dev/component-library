import Image from "next/image";
import Link from "next/link";

interface FeaturedCardProps {
    title: string;
    description: string;
    imageUrl: string;
    href?: string;
}

export default function FeaturedCard({ title, description, imageUrl, href }: FeaturedCardProps) {
    const CardContent = () => (
        <div className="cursor-pointer overflow-hidden relative card h-[280px] sm:h-[320px] md:h-[360px] rounded-md shadow-xl max-w-sm mx-auto">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
            {/* Dark overlay on hover */}
            <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black/60" />
            {/* Permanent gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Content container */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-2">
                    {title}
                </h1>
                <p className="font-normal text-xs sm:text-sm text-gray-100">
                    {description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-xs w-full group/card">
            {href ? (
                <Link href={href}>
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </div>
    );
}
