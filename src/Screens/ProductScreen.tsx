import ProductCard from "../components/Product/ProductCard";

const ProductScreen = () => {
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <h1 className="text-gray-900 font-bold text-2xl">상품</h1>
      <div className="container px-5 py-24 mx-auto">
        <ProductCard />
      </div>
      <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
    </section>
  );
};

export default ProductScreen;
