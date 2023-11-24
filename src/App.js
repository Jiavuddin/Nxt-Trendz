import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import Products from './components/Products';
import ProductItemDetails from './components/ProductItemDetails';
import Cart from './components/Cart';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import CartContext from './context/CartContext';
import './App.css';

function App() {

    const [cartList, setCartList] = useState(() => JSON.parse(sessionStorage.getItem('cart')) ?? []);

    const removeAllCartItems = () => {

        setCartList([]);

        sessionStorage.setItem('cart', JSON.stringify([]));
    };

    const decrementCartItemQuantity = id => {

        let updatedCartList = [...cartList];

        const item = updatedCartList.filter(eachItem => eachItem.id === id);

        if (item?.[0]?.quantity > 1) {
            updatedCartList = updatedCartList.map(eachItem => {
                if (id === eachItem.id) {
                    return { ...eachItem, quantity: eachItem.quantity - 1 };
                }
                return eachItem;
            });
        }
        else {
            updatedCartList = updatedCartList.filter(eachItem => eachItem.id !== id);
        }

        setCartList([...updatedCartList]);

        sessionStorage.setItem('cart', JSON.stringify([...updatedCartList]));
    };

    const incrementCartItemQuantity = id => {

        let updatedCartList = [...cartList];

        updatedCartList = updatedCartList.map(eachItem => {
            if (id === eachItem.id) {
                return { ...eachItem, quantity: eachItem.quantity + 1 };
            }
            return eachItem;
        });

        setCartList([...updatedCartList]);

        sessionStorage.setItem('cart', JSON.stringify([...updatedCartList]));
    };

    const removeCartItem = id => {

        let updatedCartList = [...cartList];

        updatedCartList = updatedCartList.filter(eachItem => eachItem.id !== id);

        setCartList([...updatedCartList]);

        sessionStorage.setItem('cart', JSON.stringify([...updatedCartList]));
    };

    const addCartItem = product => {

        const { id, quantity } = product;

        if (!cartList.length) {
            setCartList([{ ...product }]);

            sessionStorage.setItem('cart', JSON.stringify([{ ...product }]));
        }
        else {

            let itemPresent = cartList.filter(eachItem => eachItem.id === id);

            if (itemPresent?.length > 0) {
                itemPresent = cartList.map(eachItem => {
                    if (id === eachItem.id) {
                        return { ...eachItem, quantity: eachItem.quantity + quantity };
                    }
                    return eachItem;
                });
            }
            else {
                itemPresent = [...cartList, product];
            }

            setCartList([...itemPresent]);

            sessionStorage.setItem('cart', JSON.stringify([...itemPresent]));
        }

    };

    return (
        <CartContext.Provider
            value={{
                cartList,
                addCartItem: addCartItem,
                removeCartItem: removeCartItem,
                incrementCartItemQuantity: incrementCartItemQuantity,
                decrementCartItemQuantity: decrementCartItemQuantity,
                removeAllCartItems: removeAllCartItems,
            }}
        >
            <Routes>
                <Route exact path="/login" element={<LoginForm />} />
                <Route exact path="/" element={<ProtectedRoute path="/" element={Home} />} />
                <Route exact path="/products" element={<ProtectedRoute path="/products" element={Products} />} />
                <Route exact path="/products/:id" element={<ProtectedRoute path="/products/:id" element={ProductItemDetails} />} />
                <Route exact path="/cart" element={<ProtectedRoute path="/cart" element={Cart} />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route
                    path="*"
                    element={
                        <Navigate to="/not-found" />
                    }
                />
            </Routes>
        </CartContext.Provider>
    );
}

export default App;