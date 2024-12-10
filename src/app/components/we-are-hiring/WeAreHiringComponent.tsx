import JobCard from '@/components/ui/JobCard';
import SectionTitle from '@/components/ui/SectionTitle';

interface JobPosition {
  title: string;
  location: string;
  type: string;
  description: string;
}

const jobPositions: JobPosition[] = [
  {
    title: 'Dental Assistant',
    location: 'USA',
    type: 'Full Time',
    description: 'Join our team as a Dental Assistant and help provide exceptional patient care. Experience required.'
  },
  {
    title: 'Front Desk Coordinator',
    location: 'Remote',
    type: 'Part Time',
    description: 'Looking for an organized individual to manage patient scheduling and front office operations.'
  },
  {
    title: 'Dental Hygienist',
    location: 'Canada',
    type: 'Full Time',
    description: 'Experienced Dental Hygienist needed for preventive dental care and patient education.'
  }
];

interface WeAreHiringProps {
  backgroundColor?: string;
  popColor?: string;
}

export default function WeAreHiringComponent({
  backgroundColor = '#f6f7f9',
  popColor = '#46857f'
}: WeAreHiringProps) {
  return (
    <section 
      className="w-full" 
      style={{ backgroundColor }}
      role="region"
      aria-label="Career opportunities"
    >
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionTitle
            tagline="Careers"
            title="Join Our Expert Dentists"
            description="Join our talented team and make a difference in people's lives. We offer a supportive work environment
            where you can grow professionally while delivering exceptional patient care."
            popColor={popColor}
            className=""
          />
        </div>

        <div 
          className="space-y-6"
          role="list"
          aria-label="Available job positions"
        >
          {jobPositions.map((position, index) => (
            <article 
              key={index}
              role="listitem"
            >
              <JobCard
                {...position}
                popColor={popColor}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
