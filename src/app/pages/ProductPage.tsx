import { useState } from 'react';
import { Heart, Share2, Shield, Truck, RotateCcw, ShoppingCart } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { QuantityInput } from '../components/QuantityInput';
import { useCartStore } from '../../store/cartStore';
import { Variant } from '../../types/product';
import productsData from '../../data/products.json';

export function ProductPage() {
  // TODO: Replace with useParams() to get slug from URL and fetch product by slug
  const product = productsData[0];
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants.find((v) => v.stock > 0) || product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

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
    <div className="bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ImageGallery
              images={selectedVariant.images}
              productName={product.name}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl mb-2">{product.name}</h1>
              <p className="text-2xl">${selectedVariant.price}</p>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />

            <div>
              <h3 className="text-sm mb-3">Quantity</h3>
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
                className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t">
              <h3>Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Free shipping over $100</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs text-gray-600">30-day returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs text-gray-600">2-year warranty</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-xl">${selectedVariant.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={selectedVariant.stock === 0}
            className="flex-1 py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
