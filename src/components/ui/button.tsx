import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import anime from 'animejs'
import { GoArrowUpRight } from 'react-icons/go'

/**
 * Available hover animation effects for the button.
 * - none: No animation
 * - fill-in: Background color fills in from center
 * - fill-up: Background color fills up from bottom
 * - pulse: Button scales up slightly
 * - slide: Background slides in from left
 * - reveal-arrow: Reveals an arrow icon on hover
 * - reveal-icon: Reveals a custom icon on hover
 */
export type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide' | 'reveal-arrow' | 'reveal-icon';

/**
 * Button variant styles using class-variance-authority.
 * Provides consistent styling with variants for different use cases.
 * 
 * Base styles include:
 * - Flexbox layout for content alignment
 * - Focus states for accessibility
 * - Disabled states
 * - Overflow handling for animations
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden relative",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
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
        "reveal-arrow": "relative w-fit",
        "reveal-icon": "relative w-fit"
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
  /** Enable Radix UI Slot pattern for custom element rendering */
  asChild?: boolean
  /** Custom background color (overrides variant) */
  bgColor?: string
  /** Animation effect on hover */
  hoverEffect?: ButtonHoverEffect
  /** Custom icon for reveal-icon effect */
  icon?: React.ReactNode
  /** Color for hover animation overlay */
  hoverColor?: string
  /** Color for the icon (defaults to current text color) */
  iconColor?: string
}

/**
 * Enhanced button component with animation effects.
 * 
 * Features:
 * - Multiple style variants and sizes
 * - Hover animation effects using AnimeJS
 * - Progressive enhancement via ProgressiveButton wrapper
 * - Custom background colors
 * - Icon reveal animations
 * 
 * Animation System:
 * - Uses AnimeJS for smooth, performant animations
 * - Handles animation interruption and cleanup
 * - Maintains animation state to prevent conflicts
 * - Provides separate enter/leave animations for each effect
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hoverEffect = 'none', asChild = false, bgColor, hoverColor = 'black', style, icon: Icon, ...props }, ref) => {
    const elementRef = React.useRef<HTMLButtonElement | null>(null)
    const overlayRef = React.useRef<HTMLDivElement>(null)
    const animationRef = React.useRef<anime.AnimeInstance | null>(null)
    const isAnimatingRef = React.useRef(false)

    // Merge forwarded ref with local ref for animation control
    const mergedRef = React.useMemo(() => {
      return (node: HTMLButtonElement | null) => {
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        elementRef.current = node
      }
    }, [ref])

    React.useEffect(() => {
      if (!elementRef.current || !overlayRef.current || hoverEffect === 'none') return

      const element = elementRef.current
      const overlay = overlayRef.current

      // Animation configurations for each hover effect
      const animations = {
        'fill-up': {
          scaleY: [0, 1],
          translateY: ['100%', '0%'],
          duration: 500,
          easing: 'easeOutQuad'
        },
        'fill-in': {
          scaleY: [0, 1],
          duration: 250,
          easing: 'easeOutQuad'
        },
        'slide': {
          translateX: ['-100%', '0%'],
          duration: 300,
          easing: 'easeOutCubic'
        },
        'pulse': {
          scale: [1, 1.1],
          duration: 200,
          easing: 'easeInOutQuad'
        },
        'reveal-arrow': {
          translateX: ['32px', '0px'],
          duration: 200,
          easing: 'easeOutQuad'
        },
        'reveal-icon': {
          translateX: ['32px', '0px'],
          duration: 200,
          easing: 'easeOutQuad'
        }
      }

      // Exit animations for smooth transitions
      const leaveAnimations = {
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
          duration: 200,
          easing: 'easeInCubic'
        },
        'pulse': {
          scale: [1.1, 1],
          duration: 200,
          easing: 'easeInOutQuad'
        },
        'reveal-arrow': {
          translateX: ['32px', '0px'],
          duration: 200,
          easing: 'easeOutQuad'
        },
        'reveal-icon': {
          translateX: ['32px', '0px'],
          duration: 200,
          easing: 'easeOutQuad'
        }
      }

      // Handle mouse enter animation
      const mouseEnter = () => {
        if (isAnimatingRef.current) animationRef.current?.pause();
        isAnimatingRef.current = true;

        if (hoverEffect === 'reveal-arrow' || hoverEffect === 'reveal-icon') {
          const textElement = element.querySelector('.button-text');
          animationRef.current = anime.timeline({
            complete: () => { isAnimatingRef.current = false }
          })
            .add({
              targets: overlay,
              translateX: ['32px', '0px'],
              duration: 200,
              easing: 'easeOutQuad'
            })
            .add({
              targets: textElement,
              translateX: [0, '-10px'],
              duration: 200,
              easing: 'easeOutQuad'
            }, '-=200');
        } else {
          // Standard hover effects
          animationRef.current = anime({
            targets: overlay,
            ...animations[hoverEffect as keyof typeof animations],
            complete: () => { isAnimatingRef.current = false }
          });
        }
      };

      // Handle mouse leave animation
      const mouseLeave = () => {
        if (isAnimatingRef.current) animationRef.current?.pause()
        isAnimatingRef.current = true

        if (hoverEffect === 'reveal-arrow' || hoverEffect === 'reveal-icon') {
          const textElement = element.querySelector('.button-text')
          animationRef.current = anime.timeline({
            complete: () => {
              isAnimatingRef.current = false
              if (textElement) anime.set(textElement, { color: '' })
            }
          })
            .add({
              targets: overlay,
              translateX: '32px',
              duration: 200,
              easing: 'easeInQuad'
            })
            .add({
              targets: textElement,
              translateX: 0,
              duration: 200,
              easing: 'easeInQuad'
            }, '-=200')
        } else {
          animationRef.current = anime({
            targets: overlay,
            ...leaveAnimations[hoverEffect as keyof typeof leaveAnimations],
            complete: () => { isAnimatingRef.current = false }
          })
        }
      }

      // Attach event listeners
      element.addEventListener('mouseenter', mouseEnter)
      element.addEventListener('mouseleave', mouseLeave)

      // Cleanup event listeners and animations
      return () => {
        element.removeEventListener('mouseenter', mouseEnter)
        element.removeEventListener('mouseleave', mouseLeave)
        animationRef.current?.pause()
      }
    }, [hoverEffect])

    const buttonStyle = bgColor
      ? { ...style, backgroundColor: bgColor } as React.CSSProperties
      : style

    // Render button with or without Radix UI Slot
    if (!asChild) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }), "group")}
          ref={mergedRef}
          type={props.type ?? "button"}
          style={buttonStyle}
          {...props}
        >
          <span className="relative z-10 button-text">
            {props.children}
          </span>
          {hoverEffect === 'reveal-arrow' && (
            <div
              ref={overlayRef}
              className="absolute top-0 right-0 h-full w-[32px] flex items-center justify-center transform translate-x-[32px]"
              style={{ backgroundColor: hoverColor }}
            >
              <GoArrowUpRight className={cn("w-4 h-4", !props.iconColor && "text-white")} style={props.iconColor ? { color: props.iconColor } : undefined} />
            </div>
          )}
          {hoverEffect === 'reveal-icon' && Icon && (
            <div
              ref={overlayRef}
              className="absolute top-0 right-0 h-full w-[32px] flex items-center justify-center transform translate-x-[32px]"
              style={{ backgroundColor: hoverColor }}
            >
              {React.isValidElement(Icon) && props.iconColor
                ? React.cloneElement(Icon as React.ReactElement, {
                    className: (Icon as React.ReactElement).props.className,
                    style: { ...(Icon as React.ReactElement).props.style, color: props.iconColor }
                  })
                : Icon}
            </div>
          )}
          {hoverEffect !== 'none' && hoverEffect !== 'reveal-arrow' && hoverEffect !== 'reveal-icon' && (
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none transform"
              style={{
                backgroundColor: hoverColor,
                transform: hoverEffect === 'fill-up' ? 'scaleY(0) translateY(100%)' :
                  hoverEffect === 'fill-in' ? 'scaleY(0)' :
                    hoverEffect === 'slide' ? 'translateX(-100%)' : 'scale(1)',
                transformOrigin: hoverEffect === 'fill-up' ? 'bottom' :
                  hoverEffect === 'fill-in' ? 'top' : 'left'
              }}
            />
          )}
        </button>
      )
    }

    // asChild = true scenario:
    // ProgressiveButton will pass a single React element (like <Link>...) as children.
    // We must return exactly one child to Slot. We clone that child to insert text & overlays.
    const child = React.Children.only(props.children) as React.ReactElement
    return (
      <Slot>
        {React.cloneElement(child, {
          className: cn(buttonVariants({ variant, size, className }), "group", child.props.className),
          ref: mergedRef,
          style: { ...buttonStyle, ...child.props.style }
        },
          <>
            <span className="relative z-10 button-text">
              {child.props.children}
            </span>
            {hoverEffect === 'reveal-arrow' && (
              <div
                ref={overlayRef}
                className="absolute top-0 right-0 h-full w-[32px] flex items-center justify-center transform translate-x-[32px]"
                style={{ backgroundColor: hoverColor }}
              >
                <GoArrowUpRight className={cn("w-4 h-4", !props.iconColor && "text-white")} style={props.iconColor ? { color: props.iconColor } : undefined} />
              </div>
            )}
            {hoverEffect === 'reveal-icon' && Icon && (
              <div
                ref={overlayRef}
                className="absolute top-0 right-0 h-full w-[32px] flex items-center justify-center transform translate-x-[32px]"
                style={{ backgroundColor: hoverColor }}
              >
                {React.isValidElement(Icon) && props.iconColor
                  ? React.cloneElement(Icon as React.ReactElement, {
                      className: (Icon as React.ReactElement).props.className,
                      style: { ...(Icon as React.ReactElement).props.style, color: props.iconColor }
                    })
                  : Icon}
              </div>
            )}
            {hoverEffect !== 'none' && hoverEffect !== 'reveal-arrow' && hoverEffect !== 'reveal-icon' && (
              <div
                ref={overlayRef}
                className="absolute inset-0 pointer-events-none transform"
                style={{
                  backgroundColor: hoverColor,
                  transform: hoverEffect === 'fill-up' ? 'scaleY(0) translateY(100%)' :
                    hoverEffect === 'fill-in' ? 'scaleY(0)' :
                      hoverEffect === 'slide' ? 'translateX(-100%)' : 'scale(1)',
                  transformOrigin: hoverEffect === 'fill-up' ? 'bottom' :
                    hoverEffect === 'fill-in' ? 'top' : 'left'
                }}
              />
            )}
          </>)}
      </Slot>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
