// Relative Path: ./OverlayLapCounter.tsx
import React from 'react';
import styles from './OverlayLapCounter.scss';

// Remember to create a sibling SCSS file with the same name as this component

const OverlayLapCounter: React.FC<any> = ({current}:{current?:any}) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='-overlay-lap-counter'>
{JSON.stringify(current||undefined)}
      </div>
    </>
  );
};

export default OverlayLapCounter;