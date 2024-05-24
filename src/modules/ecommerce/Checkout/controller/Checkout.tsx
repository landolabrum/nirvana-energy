import React, { useEffect, useState } from 'react';
import styles from './Checkout.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import useCart from '../../cart/hooks/useCart';
import { useUser } from '~/src/core/authentication/hooks/useUser';

import SignUp from '~/src/modules/authentication/views/SignUp/SignUp';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';

import Login from '~/src/modules/authentication/views/Login/controller/Login';
import UserContext from '~/src/models/UserContext';
import Collect from '../views/Collect/controller/Collect';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import CartList from '../../cart/views/CartList/CartList';
import { useNotification } from '@webstack/components/Notification/Notification';
import { IView } from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';


const Checkout = ():React.JSX.Element => {
    const user = useUser();
    const [view, setView] = useState<any>();
    const [_cart, setCart] = useState<any>();
    const [selectedUser, setUser] = useState<UserContext | {email:string} | undefined>();
    const {cart } = useCart();
    const guest = useGuest();
    const handleSignUp = (res: any) => {
        const selectedUser = res?.id && res || guest;
        console.log('[handleSignUp ]',res)
        if (['guest','created'].includes(res?.status)) {
            handleUser()
            setView('collect');
            handleNotifictaion(res);
        }
        else if(res?.status === 'existing' && res?.email){
            setUser({email:res.email});
            setView('existing');
        }
        else {
            console.log('[ CHECKOUT (HANDLE SIGNUP)[ERROR] ]', res);
        }
    }
    const [notification, setNotification]=useNotification();
    type InotificationContext = {data: string, email: string, status: "existing" | "created" | "success"}
    const handleNotifictaion = (notificationContext: InotificationContext) =>{
        console.log('[ handleNotification ]',notificationContext)
      const status = notificationContext.status;
        setNotification({
          active: true,
          // persistence: 3000,
          list:[{name:`email ${status}, sign in to continue`}]});
      console.log('[ NOTIFICIATION ]', {notification, notificationContent: notificationContext})
    }
    const views: IView = {
        'sign-up': (
            <SignUp
                title="Contact info"
                hasPassword={false}
                btnText='continue'
                onSuccess={handleSignUp}
            />),
        'existing': (
            <Login onSuccess={handleSignUp} title={`Account for ${selectedUser?.email}, exists. please sign in.`} email={selectedUser?.email} />
        ),
        'collect': (
            <Collect
                user={selectedUser}
                cart_items={_cart}
            />
        )
    }
    const handleUser = () => {
        if(selectedUser)return;
        console.log('[ USER ]', {user, prospect: guest})
        if (user || guest) {
            setView('collect');
            setUser(user || guest);
        }else {
            setView('sign-up');
        }
    }
    const handleCart = () =>{
        if(_cart)return;
        setCart(cart);
    }
    useEffect(() => {
        handleUser();
        handleCart();
    }, [handleUser, handleCart]);

    if (view) return <>
        <style jsx>{styles}</style>
        {/* user: {JSON.stringify(prospect)} */}
        <div className='checkout' id="main-checkout">
            <div className='checkout__title'>
                Secure Checkout <UiIcon icon="fa-lock" />
            </div>
            <div className='checkout__button'>
                Step {view === 'sign-up'?'1':'2'} of 2
            </div>
            <CartList adjustable={false} variant='mini'/>
            <div className='checkout__body'>
                {views[view]}
            </div>
        </div>
    </>;
    return (<UiLoader />)
};

export default Checkout;