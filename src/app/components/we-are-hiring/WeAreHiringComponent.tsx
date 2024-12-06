import React from 'react';
import JobCard from '@/components/ui/JobCard';

export const metadata = {
  name: 'We Are Hiring',
  type: 'Section Component',
  description: 'A modern job listing section with hover effects and clear job descriptions.',
  tags: ['layout', 'light', 'hiring'],
  dateAdded: '2024-12-06'
};

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
    <div className="w-full" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: popColor }}>
            Careers
          </p>
          <h2 className="text-4xl font-bold mb-4">
            Join Our Expert Dentists
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our talented team and make a difference in people's lives. We offer a supportive work environment
            where you can grow professionally while delivering exceptional patient care.
          </p>
        </div>

        <div className="space-y-6">
          {jobPositions.map((position, index) => (
            <JobCard
              key={index}
              {...position}
              popColor={popColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
