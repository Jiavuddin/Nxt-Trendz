import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ThreeDots } from 'react-loader-spinner';
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs';
import CartContext from '../../context/CartContext';
import Header from '../Header';
import SimilarProductItem from '../SimilarProductItem';
import './index.css';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
};

function ProductItemDetails() {

    const navigate = useNavigate();

    const location = useLocation();

    const { id } = useParams();

    const [state, setState] = useState({
        productData: {},
        similarProductsData: [],
        apiStatus: apiStatusConstants.initial,
        quantity: 1,
    });

    useEffect(() => {
        getProductData();
    }, [id]);

    const updateSimilarProducts = (id) => {

        const parts = location.pathname.split('/');

        parts[parts.length - 1] = id;

        const updatedPath = parts.join('/');

        navigate(updatedPath);

        window.scrollTo(0, 0);

    };

    const getFormattedData = data => ({
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
    });

    const getProductData = async () => {

        setState(prevState => ({
            ...prevState,
            apiStatus: apiStatusConstants.inProgress
        }));

        const jwtToken = Cookies.get('jwt_token');

        const apiUrl = `https://apis.ccbp.in/products/${id}`;

        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        };

        const response = await fetch(apiUrl, options);

        if (response.ok) {

            const fetchedData = await response.json();

            const updatedData = getFormattedData(fetchedData);

            const updatedSimilarProductsData = fetchedData.similar_products.map(eachSimilarProduct => getFormattedData(eachSimilarProduct));

            setState(prevState => ({
                ...prevState,
                productData: updatedData,
                similarProductsData: updatedSimilarProductsData,
                apiStatus: apiStatusConstants.success
            }));
        }

        if (response.status === 404) {
            setState(prevState => ({
                ...prevState,
                apiStatus: apiStatusConstants.failure
            }));
        }
    };

    const renderLoadingView = () => (
        <div className="products-details-loader-container" testid="loader">
            <ThreeDots
                height="50"
                width="50"
                radius="9"
                color="#0b69ff"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            />
        </div>
    );

    const renderFailureView = () => (
        <div className="product-details-error-view-container">
            <img
                alt="error view"
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
                className="error-view-image"
            />
            <h1 className="product-not-found-heading">Product Not Found</h1>
            <Link to="/products">
                <button type="button" className="button">
                    Continue Shopping
                </button>
            </Link>
        </div>
    );

    const onDecrementQuantity = () => {
        const { quantity } = state;

        if (quantity > 1) {
            setState(prevState => ({
                ...prevState,
                quantity: prevState.quantity - 1
            }));
        }
    };

    const onIncrementQuantity = () => {
        setState(prevState => ({
            ...prevState,
            quantity: prevState.quantity + 1
        }));
    };

    const renderProductDetailsView = () => (
        <CartContext.Consumer>
            {value => {

                const { productData, quantity, similarProductsData } = state;

                const {
                    availability,
                    brand,
                    description,
                    imageUrl,
                    price,
                    rating,
                    title,
                    totalReviews,
                } = productData;

                const { addCartItem } = value;

                const onClickAddToCart = () => {
                    addCartItem({ ...productData, quantity });
                };

                return (
                    <div className="product-details-success-view">
                        <div className="product-details-container">
                            <img src={imageUrl} alt="product" className="product-image" />
                            <div className="product">
                                <h1 className="product-name">{title}</h1>
                                <p className="price-details">Rs {price}/-</p>
                                <div className="rating-and-reviews-count">
                                    <div className="rating-container">
                                        <p className="rating">{rating}</p>
                                        <img
                                            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                                            alt="star"
                                            className="star"
                                        />
                                    </div>
                                    <p className="reviews-count">{totalReviews} Reviews</p>
                                </div>
                                <p className="product-description">{description}</p>
                                <div className="label-value-container">
                                    <p className="label">Available:</p>
                                    <p className="value">{availability}</p>
                                </div>
                                <div className="label-value-container">
                                    <p className="label">Brand:</p>
                                    <p className="value">{brand}</p>
                                </div>
                                <hr className="horizontal-line" />
                                <div className="quantity-container">
                                    <button
                                        type="button"
                                        className="quantity-controller-button"
                                        onClick={onDecrementQuantity}
                                        testid="minus"
                                    >
                                        <BsDashSquare className="quantity-controller-icon" />
                                    </button>
                                    <p className="quantity">{quantity}</p>
                                    <button
                                        type="button"
                                        className="quantity-controller-button"
                                        onClick={onIncrementQuantity}
                                        testid="plus"
                                    >
                                        <BsPlusSquare className="quantity-controller-icon" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="button add-to-cart-btn"
                                    onClick={onClickAddToCart}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                        <h1 className="similar-products-heading">Similar Products</h1>
                        <ul className="similar-products-list">
                            {similarProductsData.map(eachSimilarProduct => (
                                <SimilarProductItem
                                    productDetails={eachSimilarProduct}
                                    updateSimilarProducts={updateSimilarProducts}
                                    key={eachSimilarProduct.id}
                                />
                            ))}
                        </ul>
                    </div>
                )
            }}
        </CartContext.Consumer>
    );

    const renderProductDetails = () => {

        const { apiStatus } = state;

        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderProductDetailsView();
            case apiStatusConstants.failure:
                return renderFailureView();
            case apiStatusConstants.inProgress:
                return renderLoadingView();
            default:
                return null
        }
    };

    return (
        <>
            <Header />
            <div className="product-item-details-container">
                {renderProductDetails()}
            </div>
        </>
    )
}

export default ProductItemDetails;