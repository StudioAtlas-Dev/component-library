import ImageComparisonComponent from './ImageComparisonComponent';

export default function Page() {
    return (
        <div className="min-h-screen items-center justify-center flex">
            <ImageComparisonComponent image1="/images/2024.jpg" image2="/images/2025.jpg" handlebarStyle="glass" height={600} width={800}/>
        </div>
    );
}