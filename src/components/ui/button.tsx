import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import anime from 'animejs'

// Honestly, I'm more proud of this custom button component than the actual component library
// Pass the href prop to use Next.js Link component, otherwise defaults to button keeping same style

export type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide';

// Helper type to extract the correct ref type from a component or HTML element
type ElementRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

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
        grid: "h-12 px-6 py-2 text-sm sm:px-8",
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
  href?: string
  target?: string
  hoverEffect?: ButtonHoverEffect
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, size, hoverEffect = 'none', asChild = false, bgColor, style, href, target, type = "button", ...props }, ref) => {
    // Internal ref to track the DOM element for animations
    // We use HTMLElement instead of HTMLButtonElement to support both button and anchor elements
    const elementRef = React.useRef<HTMLElement | null>(null);
    
    // Ref for the overlay div used in hover animations
    const overlayRef = React.useRef<HTMLDivElement>(null);
    
    // Refs to track animation state
    const animationRef = React.useRef<anime.AnimeInstance | null>(null);
    const isAnimatingRef = React.useRef(false);
    
    // Create a merged ref callback that handles both the forwarded ref and our internal ref
    // This is memoized to prevent unnecessary re-renders
    const mergedRef = React.useMemo(() => {
      return (node: HTMLElement | null) => {
        // Handle the forwarded ref which can be either a function ref or an object ref
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        
        // Update our internal ref for animation handling
        elementRef.current = node
      }
    }, [ref]) // Only recreate if the forwarded ref changes
    
    React.useEffect(() => {
      if (!elementRef.current || !overlayRef.current || hoverEffect === 'none') return;

      const element = elementRef.current;
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
          translateX: ['0%', '-100%'],
          duration: 500,
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

      element.addEventListener('mouseenter', mouseEnter);
      element.addEventListener('mouseleave', mouseLeave);

      return () => {
        element.removeEventListener('mouseenter', mouseEnter);
        element.removeEventListener('mouseleave', mouseLeave);
        animationRef.current?.pause();
      };
    }, [hoverEffect]);

    const buttonStyle = bgColor ? {
      ...style,
      backgroundColor: bgColor,
    } as React.CSSProperties : style

    if (href) {
      return (
        <a
          href={href}
          target={target}
          className={cn(buttonVariants({ variant, size, className }), "group")}
          style={buttonStyle}
          ref={mergedRef as ElementRef<'a'>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
          {hoverEffect !== 'none' && (
            <div
              ref={overlayRef}
              className="absolute -inset-[1px] bg-black opacity-90 pointer-events-none transform"
              style={{ 
                transform: hoverEffect === 'fill-up' ? 'scaleY(0) translateY(100%)' : 
                          hoverEffect === 'fill-in' ? 'scaleY(0)' :
                          hoverEffect === 'slide' ? 'translateX(-100%)' : 'scale(1)',
                transformOrigin: hoverEffect === 'fill-up' ? 'bottom' :
                               hoverEffect === 'fill-in' ? 'top' : 'left'
              }}
            />
          )}
        </a>
      )
    }

    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "group")}
        ref={mergedRef}
        type={asChild ? undefined : type}
        style={buttonStyle}
        {...props}
      >
        {hoverEffect !== 'none' && (
          <div
            ref={overlayRef}
            className="absolute -inset-[1px] bg-black opacity-90 pointer-events-none transform"
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
