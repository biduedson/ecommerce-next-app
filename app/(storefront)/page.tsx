import CategorySelection from "../components/storefront/CategorySelection";
import FeaturedProducts from "../components/storefront/FeaturedProducts";
import Hero from "../components/storefront/Hero";
import NavBar from "../components/storefront/NavBar";

const IndexPage = () => {
  return (
    <div>
      <Hero />
      <CategorySelection />
      <FeaturedProducts />
    </div>
  );
};

export default IndexPage;
