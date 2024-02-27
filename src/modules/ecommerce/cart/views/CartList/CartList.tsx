import styles from './CartList.scss';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import ProductBuyNow from '../../../ProductDescription/views/ProductBuyNow/ProductBuyNow';
import { ITraits } from '@webstack/components/FormControl/FormControl';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import Image from 'next/image';
import { Key } from 'react';
import { IProduct } from '~/src/models/Shopping/IProduct';

// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty, collapse = false, variant, traits }: { cart: any, handleQty: (item: any) => void; collapse?: boolean, variant: string, traits: ITraits }) => {
    if (!cart) return <>error code: cl1 NO CART</>;
    const CartItems = ({ fullWidth }: { fullWidth?: boolean }) => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list'>
                <AdaptGrid xs={1}>
                    {cart && cart.map((item: IProduct | undefined, key: Key | null | undefined) => (
                        <div className="cart-list__item" key={key}>
                            <div className={`cart-list__item-content ${variant == 'mini' ? "cart-list__item-content-mini" : ''}`}>
                                <div className="cart-list__item-image" data-name={item?.name}>
                                    {/* <ProductImage image={item.images} options={{
                                        size: "100px", style: {
                                            borderRadius: "10px"
                                        }
                                    }} /> */}
                                    {item && Object.values(item.images).map(i =>
                                        <Image
                                            key={item.name}
                                            src={i}
                                            alt={item.name}
                                            quality={100}
                                            fill
                                            sizes="100%"
                                            style={{
                                                objectFit: 'contain',
                                            }}

                                        />
                                    )}
                                </div>
                                <div className={`cart-list__item-body`}>
                                    <div className="cart-list__item-name">
                                        {item?.name}
                                    </div>
                                    <div className="cart-list__item-description">
                                        {item?.description}
                                    </div>
                                    <div className="cart-list__item-amount">
                                        {item?.price?.unit_amount?numberToUsd(item?.price.unit_amount):'price not available'}
                                    </div>
                                </div>
                                <div className="cart-list__item-action">
                                    <ProductBuyNow traits={traits} product={item} />
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </AdaptGrid>
            </div>
        </>
    }


    if (collapse) return (<>
        <style jsx>{styles}</style>
        <UiCollapse
            label={
                <div className='cart-list__collapse-label'>
                    <UiIcon icon='fal-bags-shopping' />
                    <div className='cart-list__collapse-label-items'>
                        {cart && cart.length <= 2 && cart.map((value: any, index: any) => { return <div key={index} className='cart-list__collapse-label-item'>{value?.name}  ( {value?.price?.qty}x )</div> }
                        )}
                    </div>
                </div>
            }>
            <CartItems fullWidth />
        </UiCollapse>
    </>
    );
    return <CartItems />
};

export default CartList;