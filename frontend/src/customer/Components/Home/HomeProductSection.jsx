import AliceCarousel from "react-alice-carousel";
import HomeProductCard from "./HomeProductCard";
import "./HomeProductSection.css";
import { useState } from "react";

const HomeProductSection = ({ section, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));
  const slideNext = () => setActiveIndex((prev) => Math.min(prev + 1, data?.slice(0, 10).length - 1));
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const responsive = {
    0: {
      items: 1,
      itemsFit: "contain",
    },
    640: {
      items: 2,
      itemsFit: "contain",
    },
    1024: {
      items: 4,
      itemsFit: "contain",
    },
  };

  const items = data?.slice(0, 10).map((item, index) => (
    <div key={item._id || item.title || index} className="flex justify-center px-2">
      <HomeProductCard product={item} />
    </div>
  ));

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 transition duration-500 hover:shadow-lg">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Collection</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">{section}</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={slidePrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            aria-label="Previous"
          >
            &larr;
          </button>
          <button
            onClick={slideNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            aria-label="Next"
          >
            &rarr;
          </button>
        </div>
      </div>

      <AliceCarousel
        disableButtonsControls
        disableDotsControls
        mouseTracking
        items={items}
        activeIndex={activeIndex}
        responsive={responsive}
        onSlideChanged={syncActiveIndex}
        animationType="slide"
        animationDuration={600}
      />
    </div>
  );
};

export default HomeProductSection;
