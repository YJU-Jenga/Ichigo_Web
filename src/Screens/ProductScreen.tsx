import { NavLink } from "react-router-dom";
import ProductCard from "../components/Product/ProductCard";
import { UserProps } from "../App";

const ProductScreen = ({ user }: UserProps) => {
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <h1 className="text-gray-900 font-bold text-2xl">상품</h1>
      <NavLink
        to={"/addproduct"}
        className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
      >
        상품추가
      </NavLink>
      <div className="container px-5 py-24 mx-auto">
        <ProductCard />
      </div>
      <div className="flex items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
    </section>
  );
};

export default ProductScreen;
