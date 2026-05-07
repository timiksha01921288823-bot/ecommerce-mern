import React from "react";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();
  const productId = product?._id || product?.id || product?.productId;

  const handleNavigate = () => {
    if (productId) {
      navigate(`/product/${productId}`);
      return;
    }
    navigate("/");
  };

  return (
    <article
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleNavigate();
      }}
      className="group flex max-w-xs cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden bg-slate-100">
        <img
          className="h-72 w-full object-cover object-top transition duration-500 group-hover:scale-105"
          src={product?.image || product?.imageUrl}
          alt={product?.title || product?.brand}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{product?.brand || "Premium"}</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">{product?.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{product?.color || "Timeless design"}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">₹{product?.discountedPrice || product?.price}</p>
            {product?.price && product?.discountedPrice && (
              <p className="text-sm text-slate-400 line-through">₹{product?.price}</p>
            )}
          </div>
          {product?.discountPersent && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              {product.discountPersent}% off
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default HomeProductCard;
