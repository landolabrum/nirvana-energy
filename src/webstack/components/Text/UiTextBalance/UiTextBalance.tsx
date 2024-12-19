import React, { useEffect, useRef, useState } from 'react';
import styles from './UiTextBalance.scss';

interface IUiTextBalance {
  text: string; // Text to display
  className?: string; // Optional class for additional styling
}

const UiTextBalance: React.FC<IUiTextBalance> = ({ text, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const words = text.split(' ');
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const newScales: number[] = [];
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      testDiv.style.whiteSpace = 'nowrap';
      testDiv.style.fontWeight = 'bold';
      testDiv.style.textTransform = 'uppercase'; // Match design style
      document.body.appendChild(testDiv);

      words.forEach((word) => {
        let fontSize = 10; // Start small
        testDiv.style.fontSize = `${fontSize}px`;
        testDiv.innerText = word;

        // Scale until it fits within both width and height constraints
        while (
          testDiv.offsetWidth < containerWidth * 0.9 && // Add margin for width (90% of container)
          testDiv.offsetHeight < containerHeight / words.length
        ) {
          fontSize += 1;
          testDiv.style.fontSize = `${fontSize}px`;
        }

        // Step back once it overflows
        fontSize -= 1;
        newScales.push(fontSize);
      });

      setScales(newScales);
      document.body.removeChild(testDiv);
    }
  }, [text]);

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={containerRef} className={`ui-text-balance ${className || ''}`}>
        {text.split(' ').map((word, index) => (
          <div
            key={index}
            style={{
              fontSize: scales[index] ? `${scales[index]}px` : '10px',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </>
  );
};

export default UiTextBalance;
