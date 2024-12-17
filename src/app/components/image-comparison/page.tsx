import ImageComparisonComponent from './ImageComparisonComponent';

export default function Page() {
    return (
        <div className="min-h-screen items-center justify-center flex">
            <ImageComparisonComponent image1="/images/gym-join.jpg" image2="/images/gym-instructor.jpg"/>
        </div>
    );
}