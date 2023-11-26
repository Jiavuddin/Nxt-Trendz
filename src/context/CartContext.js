import React from 'react';

const CartContext = React.createContext({
    cartList: JSON.parse(sessionStorage.getItem('cart')) ?? [],
    removeAllCartItems: () => { },
    addCartItem: () => { },
    removeCartItem: () => { },
    incrementCartItemQuantity: () => { },
    decrementCartItemQuantity: () => { },
    showThanks: false,
    setShowThanks: () => { }
});

export default CartContext;