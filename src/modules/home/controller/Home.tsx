// Relative Path: ./Home.tsx
import React from 'react';
import styles from './Home.scss';
import BannerProduct from '../../ecommerce/products/views/BannerProduct/BannerProduct';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import HomeGridItem from '../views/HomeGridItem/HomeGridItem';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import UiSettingsLayout from '@webstack/layouts/UiSettingsLayout/UiSettingsLayout';

// Remember to create a sibling SCSS file with the same name as this component

const Home = () => {
    const kwToAmps = (kw: number) => {
        const volts = 240;
        return `${((kw / volts).toFixed(2))} Amps`;
    }
    return (
        <>
            <style jsx>{styles}</style>
            <div className='home'>
                <BannerProduct />
                <div className='home__full'>
                    <div className='home--title'>
                        Helping you Create your Nirvana!
                        On and Off-grid battery back up
                    </div>
                    <div className='home__sub-title'>
                        If you're thinking about going off grid or want to learn more about backup battery systems, its time to create your
                    </div>
                </div>
                <div className='home__full'>
                    <div className='home__full--title'>
                        The Importance of Backup Batteries
                    </div>
                </div>
                <AdaptGrid sm={1} md={3} margin='0 0 45px' gapX={10} gapY={5}>
                    <HomeGridItem icon='fal-cloud-bolt-sun' title='power outages' >
                        With backup batteries, you can be sure your home will have
                        power even during outages.
                        Most batteries will only back up what's stored when the grid goes down. Be sure to get our system that refills the battery if the grid stays down.
                    </HomeGridItem>
                    <HomeGridItem icon='fa-globe' title='environmental concerns' >
                        Using solar battery backup systems helps reduce your carbon footprint. The less you rely on the grid, the more you do for our planet.
                    </HomeGridItem>
                    <HomeGridItem icon='fal-circle-dollar' title='cost savings' >
                        Solar battery backup systems can help you save money on electricity bills in the long run.
                        The 30% Federal Tax credit applies to battery storage that is connected to a PV
                    </HomeGridItem>
                </AdaptGrid>
                <div className='home__full'>
                    <div className='home--title'>
                        On-grid vs Off-grid Solar Battery Backup
                        Systems
                    </div>
                </div>
                <AdaptGrid sm={1} md={2} margin='0 0' gapX={10}>
                    <HomeGridItem title='on-grid'>
                        On-grid systems are connected to the utility grid and can sell excess energy back to the power company or store excess energy depending on how the system is
                    </HomeGridItem>
                    <HomeGridItem title='environmental concerns' >
                        Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your needs no matter how big or small and using several different power sources.
                    </HomeGridItem>
                </AdaptGrid>
                <br />
                <br />
                <h1>Don't be fooled</h1>
                <br />
                <AdapTable
                    options={{ hide: ['header', 'footer'] }}
                    onRowClick={(e) => { alert(JSON.stringify(e)) }}
                    data={[
                        {
                            manufacturer: 'Tesla',
                            'capacity-kw': 10,
                            'output-kw': 10,
                            // 'continuous-capacity-amps': `${kwToAmps(10)}`,
                        },
                        // {
                        //     brand:'Enphase ( Enchrage 10 )',
                        //     'total-capacity-kw':310.5,
                        //     'continuous-capacity':'3.84kW',
                        //     'warrenty-cycle':'4000',
                        //     'average-price':'~'
                        // },
                        // {
                        //     brand:'Generack',
                        //     'total-capacity-kw': 15.5,
                        //     'continuous-capacity':'4.5kW',
                        //     'warrenty-cycle':'4000',
                        //     'average-price':'~'
                        // },
                        // {
                        //     brand:'LG',
                        //     'total-capacity-kw':'9.6kW',
                        //     'continuous-capacity':'5kW',
                        //     'warrenty-cycle':'4000',
                        //     'average-price':'~'
                        // },
                        // {
                        //     brand:'Nirvana Energy',
                        //     'total-capacity-kw':'9.6kW',
                        //     'continuous-capacity':'5kW',
                        //     'warrenty-cycle':'4000',
                        //     'average-price':'~'
                        // }
                    ]}
                />
                <h1>Appliance Amp List</h1>
            </div>
        </>
    );
};

export default Home;