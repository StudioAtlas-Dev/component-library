// src/components/ui/SectionMask.tsx
interface SectionMaskProps {
    maskType?: 'swoop' | 'wave' | 'scalloped' | 'slant' | 'zigzag' | 'hexagonal' | 'diamond' | 'mountains' | 'circles' | 'cornerCutout';
    fill?: string;
    className?: string;
}

/**
 * Collection of SVG paths for different section divider styles
 * 
 * swoop: Gentle curve that starts at top left, dips down in first third, then sweeps up to top right
 * wave: Organic, flowing wave pattern with multiple gentle curves
 * scalloped: Series of repeating semicircles creating a decorative edge
 * slant: Simple diagonal line from top right to bottom left
 * zigzag: Sharp, angular pattern creating a series of peaks and valleys
 * hexagonal: Geometric pattern with hexagon-inspired angles
 * diamond: Symmetrical pointed shape rising from center
 * mountains: Series of varied peaks resembling a mountain range
 * circles: Overlapping circular curves creating a smooth, organic transition
 * cornerCutout: Alternating inward and outward angular cuts
 */
const MASK_PATHS = {
    swoop: "M0,0 L0,120 L1200,120 L1200,0 C600,120 300,120 0,0 Z",
    wave: "M0,80 C300,65 450,95 600,80 C750,65 900,95 1200,80 L1200,120 L0,120 Z",
    scalloped: "M0,60 Q150,120 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z",
    slant: "M0,30 L1200,120 L1200,120 L0,120 Z",
    diamond: "M0,120 L600,30 L1200,120 L1200,120 L0,120 Z",
    mountains: "M0,120 L200,40 L400,120 L600,40 L800,120 L1000,40 L1200,120 L1200,120 L0,120 Z",
    circles: "M0,120 C100,120 400,40 700,120 C700,120 1000,40 1200,120 L1200,120 L0,120 Z",
    cornerCutout: "M0,0 L100,0 L0,100 L0,0 M1200,120 L1100,120 L1200,20 L1200,120"
} as const;

export default function SectionMask({
    maskType = 'swoop',
    fill = 'white',
    className = ''
}: SectionMaskProps) {
    return (
        <div className={`absolute bottom-0 left-0 w-full overflow-hidden ${className}`}>
            <svg
                className="relative block w-full h-[400px] md:h-[500px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{ transform: 'translateY(2px)' }}
            >
                <path
                    d={MASK_PATHS[maskType as keyof typeof MASK_PATHS]}
                    fill={fill}
                />
            </svg>
        </div>
    );
}