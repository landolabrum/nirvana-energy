import React, { Children, cloneElement, useEffect, useRef, useState, isValidElement } from 'react';
import styles from './ImageControl.scss';
import UiLoader from '../UiLoader/view/UiLoader';
import useClass from '@webstack/hooks/useClass';
import { UiIcon } from '../UiIcon/UiIcon';
import { useModal } from '../modal/contexts/modalContext';

export type IImageVariant = 'center' | string;
export type IImageMediaType = 'image' | 'video';


interface IImageControl {
  variant?: IImageVariant;
  mediaType?: IImageMediaType;
  children?: React.ReactNode;
  refreshInterval?: number; // Interval in milliseconds to refresh the image
  error?: string | React.ReactElement;
  fixedLoad?: boolean;
  loadingText?: string;
  onComplete?:(e:any)=>void;
}

const ImageControl: React.FC<IImageControl> = ({ children, variant, mediaType = 'image', refreshInterval = 1000, error, loadingText, fixedLoad=false, onComplete }) => {
  const childRef = useRef<HTMLDivElement | null>(null); // Change to HTMLDivElement
  const [loading, setLoading] = useState<boolean>(true);
  // const clzz: string = useClass('image-control__element', mediaType, variant);
  const clzz: string = useClass({cls:'image-control__element', type:mediaType, variant:variant});
  const { openModal, closeModal, isModalOpen } = useModal();

  const handleExpand = () => {
    !isModalOpen ? openModal(
      {
        children: <ImageControl
          fixedLoad
          variant={variant}
          mediaType={mediaType}
          refreshInterval={refreshInterval}
        
          error={error}>
          {children}
        </ImageControl>,
        variant: 'fullscreen',
        // draggable: true
      }
    ): closeModal();
  };



  useEffect(() => {
    const mediaHeight = childRef?.current?.offsetHeight;
    if(childRef.current && !loading){
      console.log('[ onComplete ]', {src: Boolean(mediaHeight && mediaHeight > 30), loading})
      onComplete?.({src: Boolean(mediaHeight && mediaHeight > 30), loading})
    }
  },[childRef.current]);
  useEffect(() => {
    // if (!loading || error) return;
    const mediaHeight = childRef?.current?.offsetHeight;
    const imageSrc = Boolean(mediaHeight && mediaHeight > 30);
    const interval = setInterval(() => {
      if (childRef.current && imageSrc && loading == true) {
        setLoading(false);
      } else {
        if (error && !loading) setLoading(true);
      }
    }, refreshInterval);
  
    return () => clearInterval(interval);
  }, [refreshInterval, childRef.current]); // Include 'loaded' and 'mediaHeight' in dependencies

  return (
    <>
      <style jsx>{styles}</style>
      <div 
        className={`image-control${loading?' image-control__loading':""}`} 
      > {/* Attach the ref here */}
        {loading == true && <UiLoader
          position={!fixedLoad?'relative':undefined}
          text={ error || loadingText  || undefined}
          dots={['string','object'].includes(typeof error) ? false : undefined}
        />}
        <div id='image-control__element' className={`${clzz}`} ref={childRef}>
          {Children.map(children, child =>
            isValidElement(child) ? cloneElement(child) : child // Removed the ref here
          )}
        </div>
        <div className='image-control__controls'>
          <div className='image-control__controls__control'>
            <UiIcon icon='fa-play-pause' />
          </div>
          <div className='image-control__controls__control'>
            <UiIcon icon='fa-expand' onClick={handleExpand} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageControl;