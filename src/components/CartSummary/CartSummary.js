import CartContext from '../../context/CartContext';
import './CartSummary.css';

const CartSummary = () => (
    <CartContext.Consumer>
        {value => {
            const { cartList, setShowThanks } = value
            let total = 0
            cartList.forEach(eachCartItem => {
                total += eachCartItem.price * eachCartItem.quantity
            })

            const onClickCheckout = () => {
                setShowThanks(true);
            };

            return (
                <>

                    <div className="cart-summary-container">
                        <h1 className="order-total-value">
                            <span className="order-total-label">Order Total:</span> Rs {total}
                            /-
                        </h1>
                        <p className="total-items">{cartList.length} Items in cart</p>
                        <button type="button" className="checkout-button d-sm-none" onClick={onClickCheckout}>
                            Checkout
                        </button>
                    </div >
                    <button type="button" className="checkout-button d-lg-none" onClick={onClickCheckout}>
                        Checkout
                    </button>

                </>
            )
        }}
    </CartContext.Consumer>
);

export default CartSummary;