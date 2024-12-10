import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import anime from 'animejs'
import { GoArrowUpRight } from 'react-icons/go'

export type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide' | 'reveal-arrow' | 'reveal-icon';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden relative",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
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
  asChild?: boolean
  bgColor?: string
  hoverEffect?: ButtonHoverEffect
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, hoverEffect = 'none', asChild = false, bgColor, style, icon: Icon, ...props }, ref) => {
    const elementRef = React.useRef<HTMLButtonElement | null>(null)
    const overlayRef = React.useRef<HTMLDivElement>(null)
    const animationRef = React.useRef<anime.AnimeInstance | null>(null)
    const isAnimatingRef = React.useRef(false)

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
          duration: 500,
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
          duration: 500,
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

      const mouseEnter = () => {
        if (isAnimatingRef.current) animationRef.current?.pause()
        isAnimatingRef.current = true

        if (hoverEffect === 'reveal-arrow' || hoverEffect === 'reveal-icon') {
          const textElement = element.querySelector('.button-text')
          if (textElement) anime.set(textElement, { color: '#fff' })
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
            }, '-=200')
        } else {
          animationRef.current = anime({
            targets: overlay,
            ...animations[hoverEffect as keyof typeof animations],
            complete: () => { isAnimatingRef.current = false }
          })
        }
      }

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

      element.addEventListener('mouseenter', mouseEnter)
      element.addEventListener('mouseleave', mouseLeave)

      return () => {
        element.removeEventListener('mouseenter', mouseEnter)
        element.removeEventListener('mouseleave', mouseLeave)
        animationRef.current?.pause()
      }
    }, [hoverEffect])

    const buttonStyle = bgColor
      ? { ...style, backgroundColor: bgColor } as React.CSSProperties
      : style

    // If asChild = false, return the original button structure (no modifications)
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
              className="absolute top-0 right-0 h-full w-[32px] bg-black/90 flex items-center justify-center transform translate-x-[32px]"
            >
              <GoArrowUpRight className="w-4 h-4 text-white" />
            </div>
          )}
          {hoverEffect === 'reveal-icon' && Icon && (
            <div
              ref={overlayRef}
              className="absolute top-0 right-0 h-full w-[32px] bg-black/90 flex items-center justify-center transform translate-x-[32px]"
            >
              {Icon}
            </div>
          )}
          {hoverEffect !== 'none' && hoverEffect !== 'reveal-arrow' && hoverEffect !== 'reveal-icon' && (
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-black/90 pointer-events-none transform"
              style={{
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
    const cloned = React.cloneElement(child, {
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
            className="absolute top-0 right-0 h-full w-[32px] bg-black/90 flex items-center justify-center transform translate-x-[32px]"
          >
            <GoArrowUpRight className="w-4 h-4 text-white" />
          </div>
        )}
        {hoverEffect === 'reveal-icon' && Icon && (
          <div
            ref={overlayRef}
            className="absolute top-0 right-0 h-full w-[32px] bg-black/90 flex items-center justify-center transform translate-x-[32px]"
          >
            {Icon}
          </div>
        )}
        {hoverEffect !== 'none' && hoverEffect !== 'reveal-arrow' && hoverEffect !== 'reveal-icon' && (
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/90 pointer-events-none transform"
            style={{
              transform: hoverEffect === 'fill-up' ? 'scaleY(0) translateY(100%)' :
                hoverEffect === 'fill-in' ? 'scaleY(0)' :
                  hoverEffect === 'slide' ? 'translateX(-100%)' : 'scale(1)',
              transformOrigin: hoverEffect === 'fill-up' ? 'bottom' :
                hoverEffect === 'fill-in' ? 'top' : 'left'
            }}
          />
        )}
      </>)

    return (
      <Slot>
        {cloned}
      </Slot>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
