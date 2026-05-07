import React from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import { sareePage1 } from "../Data/Saree/page1";
import { dressPage1 } from "../Data/dress/page1";
import { gounsPage1 } from "../Data/Gouns/gouns";
import { kurtaPage1 } from "../Data/Kurta/kurta";
import { mensShoesPage1 } from "../Data/shoes";
import { mens_kurta } from "../Data/Men/men_kurta";
import { lengha_page1 } from "../Data/Women/LenghaCholi";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(79,70,229,0.18),_transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.45em] text-slate-200 sm:text-sm">
              New season edit
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Effortless fashion inspired by modern city life.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-200/80 sm:text-lg">
              Discover elevated wardrobe essentials, bold silhouettes, and premium fabrics designed for polished everyday looks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/style-assistant"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Style assistant
              </Link>
              <a
                href="#collections"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white hover:bg-white/20"
              >
                Browse collections
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <HomeCarousel images={homeCarouselData} />
      </section>

      <section id="collections" className="space-y-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Featured collections</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Wearable, elevated styles for every occasion.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Explore our top picks from curated categories, with quick access to the latest arrivals and best-selling essentials.
          </p>
        </div>

        <div className="space-y-20">
          <HomeProductSection data={mens_kurta} section="Men's Kurtas" />
          <HomeProductSection data={mensShoesPage1} section="Men's Shoes" />
          <HomeProductSection data={lengha_page1} section="Lengha Choli" />
          <HomeProductSection data={sareePage1} section="Saree" />
          <HomeProductSection data={dressPage1} section="Dress" />
          <HomeProductSection data={gounsPage1} section="Women's Gowns" />
          <HomeProductSection data={kurtaPage1} section="Women's Kurtas" />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
