import AnimatedHeroTextComponent from './AnimatedHeroTextComponent';

export default function Page() {
    const words = ["cleaner", "faster", "better"];
    const animationTypes = ['typing', 'falling-letters', 'blur-away', 'scrolling'] as const;

    return (
        <>
            <div className="flex justify-center items-center px-4">
                <div className="md:text-6xl text-4xl mx-auto font-normal text-neutral-800 dark:text-neutral-300">
                    Get
                    <AnimatedHeroTextComponent className="md:ml-2 font-bold" words={words} animationType="typing" /> <br />
                    designs through us.
                </div>
            </div>

            {/* Test section */}
            <div className="min-h-screen flex flex-col items-center justify-center gap-16 px-4 mt-screen">
                <h2 className="text-2xl font-bold">Animation Test Section</h2>
                
                <div className="flex flex-col gap-8 text-xl">
                    {animationTypes.map((type) => (
                        <div key={type}>
                            <p className="mb-2 font-semibold">{type.split('-').map((word: string) => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')} Animation:</p>
                            <AnimatedHeroTextComponent words={words} animationType={type} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
