import AllProductsSection from '../AllProductsSection/AllProductsSection';
import PrimeDealsSection from '../PrimeDealsSection/PrimeDealsSection';
import Header from '../Header/Header';
import './Products.css';

const Products = () => (
    <>
        <Header />
        <div className="product-sections">
            <PrimeDealsSection />
            <AllProductsSection />
        </div>
    </>
)

export default Products;