// Relative Path: ./Index.tsx
import React from 'react';
import styles from './Index.scss';
import BannerProduct from '~/src/modules/ecommerce/products/views/BannerProduct/BannerProduct';

// Remember to create a sibling SCSS file with the same name as this component

const Index: React.FC = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
        <BannerProduct/>
      </div>
    </>
  );
};

export default Index;