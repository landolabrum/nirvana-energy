import { useState, useEffect } from "react";
import CookieHelper from "@webstack/helpers/CookieHelper";
import { ICartItem } from "../model/ICartItem";

const useCart = () => {
    const [cart, setCart] = useState<ICartItem[] | null>([]);
    const getCartItems = () => {
        let cartItems: string | undefined | object = CookieHelper.getCookie('cart');
        if (typeof (cartItems) === "string") cartItems = JSON.parse(cartItems)?.items;
        return cartItems ? (cartItems as ICartItem[]) : [];
    }
    const handleQtyChange = (item: ICartItem) => {
        const cart = getCartItems();
        let updatedCart;

        if (cart.length === 0) { // Cart cookie does not exist
            updatedCart = [item]; // Create a new cart with the given item
        } else {
            const existingItem = cart.find(line_item => line_item.price_object?.id === item.price_object?.id);
            if (existingItem) {
                updatedCart = cart.map((line_item) => {
                    if (line_item.price_object?.id === item.price_object?.id) {
                        return {
                            ...line_item,
                            price_object: {
                                ...line_item.price_object,
                                qty: item.price_object.qty // Update the quantity
                            }
                        };
                    }
                    return line_item;
                });
            } else {
                updatedCart = [...cart, item]; // Add the new item to the cart
            }
        }

        // Remove items with qty = 0
        updatedCart = updatedCart.filter(line_item => line_item.price_object?.qty !== 0);

        // Check if all items have qty = 0
        if (updatedCart.length === 0) {
            CookieHelper.deleteCookie("cart");
        } else {
            CookieHelper.setCookie("cart", JSON.stringify({ items: updatedCart }), {});
        }
        setCart(updatedCart);
    };

    useEffect(() => {
        const updateCart = () => {
            setCart(getCartItems());
        };
        updateCart();
        const cookieChangeHandler = (e: CustomEvent) => {
            if (e.detail.cookieName === "cart") {
                updateCart();
            }
        }
        window.addEventListener("cookieChange", cookieChangeHandler as EventListener);
        return () => {
            window.removeEventListener("cookieChange", cookieChangeHandler as EventListener);
        };
    }, [setCart]);

    return { getCartItems, handleQtyChange };
}
export const useCartTotal = () =>{
    const { getCartItems } = useCart();
    const [totalQty, setTotalQty] = useState<number>(0);
    const cartItems = getCartItems();
    useEffect(() => {
        const newTotalQty = cartItems.reduce((sum: number, item: any) => sum + (item.price_object.qty || 0), 0);
        setTotalQty(newTotalQty);
      }, [getCartItems]);
      return totalQty
}

export default useCart;