import AnimatedHeroTextComponent from './AnimatedHeroTextComponent';

export default function Page() {

    const words = ["cleaner", "faster", "better"];

    return (
        <div className="flex justify-center items-center px-4">
            <div className="md:text-6xl text-4xl mx-auto font-normal text-neutral-800 dark:text-neutral-300">
                Get
                <AnimatedHeroTextComponent className="md:ml-2 font-bold" words={words} /> <br />
                designs through us.
            </div>
        </div>
    );
}
