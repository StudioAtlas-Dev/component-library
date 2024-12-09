import { TeamMemberCard } from '@/components/ui/TeamMemberCard';
import Image from 'next/image';
import { TeamProvider } from './TeamContext';

interface TeamMember {
  name: string;
  title: string;
  specialties: string;
  imageUrl: string;
  alt: string;
  professionalBackground: string;
  expertise: string;
}

interface MeetTheTeamComponentProps {
  variant?: 'light' | 'dark';
  backgroundImage?: string;
  heading?: string;
  subheading?: string;
  popColor?: string;
}

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Dr. Ronald Richards",
    title: "Dental Surgeon",
    specialties: "Cosmetic and Aesthetic Dentistry",
    imageUrl: "/images/team-member-1.jpg",
    alt: "Dr. Ronald Richards - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Cameron Williamson",
    title: "Dental Surgeon",
    specialties: "Cosmetic and Aesthetic Dentistry",
    imageUrl: "/images/team-member-2.jpg",
    alt: "Dr. Cameron Williamson - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Brooklyn Simmons",
    title: "Dental Surgeon",
    specialties: "Cosmetic and Aesthetic Dentistry",
    imageUrl: "/images/team-member-3.jpg",
    alt: "Dr. Brooklyn Simmons - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Savannah Nguyen",
    title: "Dental Surgeon",
    specialties: "Cosmetic and Aesthetic Dentistry",
    imageUrl: "/images/team-member-4.jpg",
    alt: "Dr. Savannah Nguyen - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Albert Flores",
    title: "Dental Surgeon",
    specialties: "Orthodontics and Implant Dentistry",
    imageUrl: "/images/team-member-5.jpg",
    alt: "Dr. Albert Flores - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Eleanor Pena",
    title: "Dental Surgeon",
    specialties: "Pediatric Dentistry and Orthodontics",
    imageUrl: "/images/team-member-6.jpg",
    alt: "Dr. Eleanor Pena - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Dianne Russell",
    title: "Dental Surgeon",
    specialties: "Periodontics and Implant Surgery",
    imageUrl: "/images/team-member-7.jpg",
    alt: "Dr. Dianne Russell - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    name: "Dr. Darlene Robertson",
    title: "Dental Surgeon",
    specialties: "Endodontics and Root Canal Therapy",
    imageUrl: "/images/team-member-8.jpg",
    alt: "Dr. Darlene Robertson - Dental Surgeon",
    professionalBackground: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }
];

export const MeetTheTeamComponent = ({
  variant = 'light',
  backgroundImage = '/images/doctor-background.jpg',
  heading = 'Meet Our Team',
  subheading = 'Our team brings together expertise and dedication to provide exceptional care.',
  popColor = '#4CAF50',
}: MeetTheTeamComponentProps): JSX.Element => {
  return (
    <TeamProvider>
      <section 
        className="relative min-h-screen w-full overflow-hidden pb-16"
        aria-label="Meet our team section"
      >
        {/* Background image container */}
        <div className="h-[60vh] relative">
          <Image
            src={backgroundImage}
            alt="Medical office interior showing our modern facilities"
            fill
            className="object-cover object-top"
            sizes="100vw"
            quality={90}
            loading="lazy" 
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.9) 80%, rgba(255,255,255,1) 100%)'
            }}
          />
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-32"> {/* Pull content up into the gradient */}
            {/* Title section */}
            <div className="text-center space-y-2 mb-16">
              <p 
                className="uppercase tracking-wider text-sm font-extrabold"
                style={{ color: popColor }}
              >
                Our Team
              </p>
              <h2 className="text-4xl font-bold text-gray-800">
                {heading}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-8">
                {subheading}
              </p>
            </div>

            {/* Team grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 relative h-fit" style={{ gridAutoRows: '150px' }}>
              {defaultTeamMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.name}
                  id={member.name}
                  {...member}
                  popColor={popColor}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </TeamProvider>
  );
};

export default MeetTheTeamComponent; 