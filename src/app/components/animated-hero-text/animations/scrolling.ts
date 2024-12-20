import anime from 'animejs';

interface ScrollingAnimationParams {
  textRef: React.RefObject<HTMLDivElement>;
  currentWord: string;
  nextWord: string;
  duration: number;
  onComplete?: () => void;
}

export const animateScrolling = ({
  textRef,
  currentWord,
  nextWord,
  duration,
  onComplete
}: ScrollingAnimationParams) => {
  if (!textRef.current) return;

  // Find the longest word and measure its width
  const longestWord = currentWord.length >= nextWord.length ? currentWord : nextWord;
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  temp.className = textRef.current.className;
  
  // Copy computed styles from the original element
  const computedStyle = window.getComputedStyle(textRef.current);
  temp.style.font = computedStyle.font;
  temp.style.fontSize = computedStyle.fontSize;
  temp.style.fontWeight = computedStyle.fontWeight;
  temp.style.letterSpacing = computedStyle.letterSpacing;
  
  temp.textContent = longestWord;
  document.body.appendChild(temp);
  const width = temp.offsetWidth;
  document.body.removeChild(temp);

  // Set container styles with padding for safety
  textRef.current.style.position = 'relative';
  textRef.current.style.height = '1.2em';
  textRef.current.style.lineHeight = '1.2em';
  textRef.current.style.overflow = 'hidden';
  textRef.current.style.width = `${width + 4}px`;
  textRef.current.style.display = 'inline-block';
  textRef.current.style.verticalAlign = 'baseline';

  // For entrance animation (first word)
  if (currentWord === nextWord) {
    anime({
      targets: textRef.current,
      translateY: ['100%', 0],
      opacity: [0, 1],
      duration: duration,
      easing: 'easeOutQuad',
      complete: onComplete
    });
    return;
  }

  // Create timeline for the transition
  const timeline = anime.timeline({
    easing: 'easeInOutQuad'
  });

  timeline
    .add({
      targets: textRef.current,
      translateY: [0, '100%'],
      opacity: [1, 0],
      duration: duration * 0.4,
      easing: 'easeInQuad',
      complete: () => {
        if (textRef.current) {
          textRef.current.textContent = nextWord;
        }
      }
    })
    .add({
      targets: textRef.current,
      translateY: ['-100%', 0],
      opacity: [0, 1],
      duration: duration * 0.4,
      easing: 'easeOutQuad',
      complete: onComplete
    });
}; 