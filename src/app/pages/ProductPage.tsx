import { useState, useEffect } from 'react';
import { Heart, Share2, Shield, Truck, RotateCcw, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ImageGallery } from '../components/ImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { QuantityInput } from '../components/QuantityInput';
import { useCartStore } from '../../store/cartStore';
import { Variant } from '../../types/product';
import productsData from '../../data/products.json';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = productsData.find((p) => p.slug === slug) || productsData[0];

  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants.find((v) => v.stock > 0) || product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariant(product.variants.find((v) => v.stock > 0) || product.variants[0]);
    setQuantity(1);
  }, [product]);

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productName: product.name,
      brand: product.brand,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.images[0],
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative">
      <BackgroundDecorations />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ImageGallery
              images={selectedVariant.images}
              productName={product.name}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl mb-2 text-neutral-900 dark:text-neutral-100 font-display">{product.name}</h1>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">${selectedVariant.price}</p>
            </div>

            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-sm mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Variant</h3>
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </div>

            <div>
              <h3 className="text-sm mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Quantity</h3>
              <QuantityInput
                value={quantity}
                onChange={setQuantity}
                max={Math.min(selectedVariant.stock, 10)}
              />
            </div>

            <div className="hidden lg:flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg disabled:bg-neutral-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-indigo-500/50"
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Free shipping over $100</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">30-day returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">2-year warranty</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 p-4 pb-safe z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Price</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">${selectedVariant.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={selectedVariant.stock === 0}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg disabled:bg-neutral-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
