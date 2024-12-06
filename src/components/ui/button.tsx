import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import anime from 'animejs'

export type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        custom: "h-14 px-8 py-4 text-base",
        grid: "h-12 px-8 py-2 text-sm",
      },
      hoverEffect: {
        none: "",
        "fill-up": "relative",
        "fill-in": "relative",
        pulse: "",
        slide: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hoverEffect: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  bgColor?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hoverEffect = 'none', asChild = false, bgColor, style, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const animationRef = React.useRef<anime.AnimeInstance | null>(null);
    const isAnimatingRef = React.useRef(false);
    
    React.useEffect(() => {
      if (!buttonRef.current || !overlayRef.current || hoverEffect === 'none') return;

      const button = buttonRef.current;
      const overlay = overlayRef.current;

      const enterAnimation = {
        'fill-up': {
          scaleY: [0, 1],
          translateY: ['100%', '0%'],
          duration: 500,
          easing: 'easeOutCubic'
        },
        'fill-in': {
          scaleY: [0, 1],
          duration: 400,
          easing: 'easeOutQuart'
        },
        'slide': {
          translateX: ['-100%', '0%'],
          duration: 500,
          easing: 'easeOutCubic'
        },
        'pulse': {
          scale: [1, 1.1],
          duration: 200,
          easing: 'easeInOutQuad'
        }
      };

      const leaveAnimation = {
        'fill-up': {
          scaleY: [1, 0],
          translateY: ['0%', '100%'],
          duration: 300,
          easing: 'easeInCubic'
        },
        'fill-in': {
          scaleY: [1, 0],
          duration: 300,
          easing: 'easeInQuart'
        },
        'slide': {
          translateX: ['0%', '100%'],
          duration: 300,
          easing: 'easeInCubic'
        },
        'pulse': {
          scale: [1.1, 1],
          duration: 200,
          easing: 'easeInOutQuad'
        }
      };

      const mouseEnter = () => {
        if (isAnimatingRef.current) {
          animationRef.current?.pause();
        }
        isAnimatingRef.current = true;
        animationRef.current = anime({
          targets: overlay,
          ...enterAnimation[hoverEffect as keyof typeof enterAnimation],
          complete: () => {
            isAnimatingRef.current = false;
          }
        });
      };

      const mouseLeave = () => {
        if (isAnimatingRef.current) {
          animationRef.current?.pause();
        }
        isAnimatingRef.current = true;
        animationRef.current = anime({
          targets: overlay,
          ...leaveAnimation[hoverEffect as keyof typeof leaveAnimation],
          complete: () => {
            isAnimatingRef.current = false;
          }
        });
      };

      button.addEventListener('mouseenter', mouseEnter);
      button.addEventListener('mouseleave', mouseLeave);

      return () => {
        button.removeEventListener('mouseenter', mouseEnter);
        button.removeEventListener('mouseleave', mouseLeave);
        animationRef.current?.pause();
      };
    }, [hoverEffect]);

    const Comp = asChild ? Slot : "button"
    const buttonStyle = bgColor ? {
      ...style,
      backgroundColor: bgColor,
    } as React.CSSProperties : style

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "group"
        )}
        ref={buttonRef}
        style={buttonStyle}
        {...props}
      >
        {hoverEffect !== 'none' && (
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black opacity-90 pointer-events-none transform"
            style={{ 
              transform: hoverEffect === 'fill-up' ? 'scaleY(0) translateY(100%)' : 
                        hoverEffect === 'fill-in' ? 'scaleY(0)' :
                        hoverEffect === 'slide' ? 'translateX(-100%)' : 'scale(1)',
              transformOrigin: hoverEffect === 'fill-up' ? 'bottom' :
                             hoverEffect === 'fill-in' ? 'top' : 'left'
            }}
          />
        )}
        <span className="relative z-10">
          {props.children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
