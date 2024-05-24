// Relative Path: ./Instagram.tsx
import React, { useState } from 'react';
import styles from './Instagram.scss';
import InstagramSignIn from '../views/InstagramSignIn/InstagramSignIn';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';


// Remember to create a sibling SCSS file with the same name as this component

const Instagram: React.FC<any> = ({ current }: { current?: string }) => {
    const [view, setView] = useState<string | undefined>('signin');

    const views = {
      signin: <InstagramSignIn />,
    };
    const viewProps = {views,currentView: view};
    return (
        <>
            <style jsx>{styles}</style>
            <div className='instagram'>
                <div className='instagram-header'>
                    <h1 className='instagram-header--title'>Instagram</h1>
                </div>
                <div className='instagram-body'>
                <div className='instagram-body--view'>
                    <UiViewLayout 
                        {...viewProps}
                    />
                </div>
                </div>
                <div>Not Responsible
                </div>
            </div>
        </>
    );
};

export default Instagram;