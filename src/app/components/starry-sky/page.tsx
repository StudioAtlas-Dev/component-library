import SectionTitle from '@/components/ui/SectionTitle';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import StarrySkyComponent from './StarrySkyComponent';
import { FaRocket } from "react-icons/fa6";

export default function StarrySkyPage() {
  return (
    <section className="relative w-full h-screen">
      <StarrySkyComponent />
      <div className="absolute inset-0 flex flex-col items-center mx-auto justify-center max-w-6xl gap-8">
        <SectionTitle
          dark
          title="Explore the Cosmos"
          description="Discover the wonders of the universe with our interactive star map."
        />
        <ProgressiveButton
          variant="outline"
          href="#"
          hoverEffect="reveal-icon"
          icon={<FaRocket className="w-4 h-4 text-white" />}
          className="text-slate-800 hover:text-slate-900 px-8"
          hoverColor="#2b2b2b"
        >
          Begin Your Journey Through the Stars
        </ProgressiveButton>
      </div>
    </section>
  );
}