import anime from 'animejs';

interface BlurAwayAnimationParams {
  textRef: React.RefObject<HTMLDivElement>;
  currentWord: string;
  nextWord: string;
  duration: number;
  onComplete?: () => void;
}

export const animateBlurAway = ({
  textRef,
  currentWord,
  nextWord,
  duration,
  onComplete
}: BlurAwayAnimationParams) => {
  if (!textRef.current) return;

  const timeline = anime.timeline({
    easing: 'easeInOutSine',
    complete: () => {
      onComplete?.();
    }
  });

  if (currentWord === nextWord) {
    timeline.add({
      targets: textRef.current,
      opacity: [0, 1],
      duration: duration,
    });
    return;
  }

  timeline
    .add({
      targets: textRef.current,
      opacity: [1, 0],
      translateY: [0, -40],
      translateX: [0, 40],
      scale: [1, 2],
      filter: ['blur(0px)', 'blur(8px)'],
      duration: duration * 0.75,
      complete: () => {
        if (textRef.current) {
          textRef.current.textContent = nextWord;
          textRef.current.style.opacity = '0';
          textRef.current.style.filter = 'blur(0px)';
          textRef.current.style.transform = 'none';
        }
      }
    })
    .add({
      targets: textRef.current,
      opacity: [0, 1],
      duration: duration * 0.25,
    });
}; 