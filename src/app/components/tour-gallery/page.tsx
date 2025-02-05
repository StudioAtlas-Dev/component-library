import TourGalleryComponent from './TourGalleryComponent';

const locations = [
    {
        location: 'Location 1',
        images: ['/images/2024.jpg']
    },
    {
        location: 'Location 2',
        images: ['/images/2025.jpg']
    },
    {
        location: 'Location 3',
        images: ['/images/gym-join.jpg']
    },
    {
        location: 'Location 4',
        images: ['/images/gym-instructor.jpg']
    }
];

const menuColor = '#6e3f23';

const logo = '/images/branded-placeholder.png';

export default function Page() {
    return (
        <div className="min-h-screen mt-20 ml-2 mr-2 overflow-hidden">
            <TourGalleryComponent
                locations={locations}
                menuColor={menuColor}
                logo={logo}
            />
        </div>
    );
}
