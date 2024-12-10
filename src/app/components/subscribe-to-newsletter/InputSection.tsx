'use client'

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Button } from '@/components/ui/button';
import { FiMail } from 'react-icons/fi';
import { showToast } from '@/components/ui/toast';

interface SubscribeResponse {
  success: boolean;
  message: string;
}

interface InputSectionProps {
  buttonText: string;
  popColor: string;
  onSubscribe?: (email: string) => Promise<SubscribeResponse>;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/;

export const InputSection = ({
  buttonText,
  popColor,
  onSubscribe = async (email) => ({ success: true, message: 'Subscribed successfully!' }),
}: InputSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      anime.set(pathRef.current, {
        strokeDashoffset: anime.setDashoffset(pathRef.current)
      });
    }
  }, []);

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    if (pathRef.current) {
      anime({
        targets: pathRef.current,
        strokeDashoffset: [anime.setDashoffset(pathRef.current), 0],
        easing: 'easeOutSine',
        duration: 600,
        direction: 'normal'
      });
    }
  };

  const handleBlur = () => {
    if (isSubmitting) return;
    
    blurTimeoutRef.current = setTimeout(() => {
      if (pathRef.current && !isSubmitting) {
        anime({
          targets: pathRef.current,
          strokeDashoffset: anime.setDashoffset(pathRef.current),
          easing: 'easeInSine',
          duration: 600,
          direction: 'normal'
        });
      }
    }, 1000);
  };

  const validateEmail = (email: string): boolean => {
    if (!EMAIL_REGEX.test(email)) {
      if (inputRef.current) {
        inputRef.current.setCustomValidity('Please enter a valid email address');
        inputRef.current.reportValidity();
      }
      return false;
    }
    
    // Check for empty parts but don't enforce arbitrary length requirements
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
      if (inputRef.current) {
        inputRef.current.setCustomValidity('Please enter a complete email address');
        inputRef.current.reportValidity();
      }
      return false;
    }

    // Clear any custom validity message if validation passes
    if (inputRef.current) {
      inputRef.current.setCustomValidity('');
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const email = inputRef.current?.value.trim();

    if (!email) {
      setIsSubmitting(false);
      if (inputRef.current) {
        inputRef.current.setCustomValidity('Please enter an email address');
        inputRef.current.reportValidity();
        inputRef.current.focus();
      }
      return;
    }

    // Clear any previous custom validity message
    if (inputRef.current) {
      inputRef.current.setCustomValidity('');
    }

    // Custom validation before HTML5 validation
    if (!validateEmail(email)) {
      setIsSubmitting(false);
      inputRef.current?.focus();
      return;
    }

    // HTML5 validation as backup
    if (inputRef.current && !inputRef.current.checkValidity()) {
      setIsSubmitting(false);
      inputRef.current.reportValidity();
      inputRef.current.focus();
      return;
    }

    try {
      const response = await onSubscribe(email);
      
      if (response.success) {
        showToast(response.message, 'success');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        showToast(response.message, 'error');
        inputRef.current?.focus();
      }
    } catch (err) {
      showToast('An error occurred. Please try again later.', 'error');
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const pathD = "M 300 55 H 8 A 7 7 0 0 1 1 48 V 8 A 7 7 0 0 1 8 1 H 592 A 7 7 0 0 1 599 8 V 48 A 7 7 0 0 1 592 55 H 300";

  return (
    <form onSubmit={handleSubmit} className="w-full object-top">
      <div className="relative w-full max-w-[600px] mx-auto">
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 56"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={popColor}
            strokeWidth="2"
          />
        </svg>
        <input
          ref={inputRef}
          type="email"
          placeholder="Enter your email"
          required
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSubmitting}
          className="w-full h-14 px-6 rounded-lg bg-white focus:outline-none disabled:opacity-50"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            variant="default"
            size="default"
            hoverEffect="reveal-icon"
            className="h-11 px-8"
            icon={<FiMail className="w-4 h-4 text-white" />}
            style={{ backgroundColor: popColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : buttonText}
          </Button>
        </div>
      </div>
    </form>
  );
}; 