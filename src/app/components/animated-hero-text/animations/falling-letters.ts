import anime from 'animejs';

interface FallingLettersAnimationParams {
  textRef: React.RefObject<HTMLDivElement>;
  currentWord: string;
  nextWord: string;
  duration: number;
  onComplete?: () => void;
}

const createLetterSpans = (word: string) => {
  return word.split('').map((letter, i) => (
    { text: letter, key: i }
  ));
};

export const animateFallingLetters = ({
  textRef,
  currentWord,
  nextWord,
  duration,
  onComplete
}: FallingLettersAnimationParams) => {
  if (!textRef.current) return;

  // If we have a text node instead of spans, convert it to spans first
  if (textRef.current.childNodes.length === 1 && textRef.current.childNodes[0].nodeType === Node.TEXT_NODE) {
    const text = textRef.current.textContent || '';
    textRef.current.textContent = '';
    text.split('').forEach(letter => {
      const span = document.createElement('span');
      span.className = 'inline-block whitespace-nowrap';
      span.textContent = letter;
      textRef.current?.appendChild(span);
    });
  }

  // Get the spans and animate them
  const letterSpans = Array.from(textRef.current.children);
  
  anime.timeline({
    easing: 'linear'
  })
  .add({
    targets: letterSpans,
    opacity: [1, 0],
    duration: duration * 0.25,
    complete: () => {
      if (textRef.current) {
        // Set up the next word
        textRef.current.innerHTML = '';
        const letterElements = createLetterSpans(nextWord);
        letterElements.forEach(({ text }) => {
          const spanNode = document.createElement('span');
          spanNode.className = 'inline-block whitespace-nowrap';
          spanNode.style.opacity = '0';
          spanNode.style.transform = 'translateY(-40px)';
          spanNode.textContent = text;
          textRef.current?.appendChild(spanNode);
        });

        // Animate the new word falling in
        anime({
          targets: textRef.current.children,
          translateY: ['-40px', 0],
          opacity: [0, 1],
          duration: duration * 0.75,
          delay: anime.stagger(100, { from: 'center' }),
          easing: 'easeOutBounce',
          complete: () => {
            onComplete?.();
          }
        });
      }
    }
  });
}; 