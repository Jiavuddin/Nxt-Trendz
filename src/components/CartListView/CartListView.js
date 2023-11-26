import CartItem from '../CartItem/CartItem';
import CartContext from '../../context/CartContext';
import './CartListView.css';

const CartListView = () => (
    <CartContext.Consumer>
        {value => {
            const { cartList, showThanks } = value;

            if (showThanks) {
                return null;
            }

            return (

                <ul className="cart-list">
                    {cartList.map(eachCartItem => (
                        <CartItem key={eachCartItem.id} cartItemDetails={eachCartItem} />
                    ))}
                </ul>
            )
        }}
    </CartContext.Consumer>
)

export default CartListView;