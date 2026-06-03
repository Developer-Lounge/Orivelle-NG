import { useState } from 'react';
import { motion } from 'motion/react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { AdvertBanner } from '../components/AdvertBanner';
import productsData from '../../data/products.json';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // TODO: Replace with actual API call to fetch products by category
  const featuredProducts = productsData;
  const flashSaleProducts = productsData.slice(0, 4);
  const moreProducts = productsData;

  return (
    <div className="min-h-screen relative">
      <BackgroundDecorations />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
        <motion.section
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl">Advertised Deals</h2>
          </div>
          <AdvertBanner />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HeroCarousel />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl mb-6">Shop by Category</h2>
          <CategoryGrid onCategorySelect={setSelectedCategory} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ProductGrid
            products={flashSaleProducts}
            title="⚡ Flash Sale"
            flashSale
            flashSaleEndDate="2026-06-15T23:59:59"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ProductGrid products={featuredProducts} title="Featured Products" />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ProductGrid products={moreProducts} title="More to Explore" />
        </motion.section>
      </div>
    </div>
  );
}
