import { Variant } from '../../types/product';
import { Check, Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const uniqueColors = Array.from(
    new Set(variants.map((v) => JSON.stringify({ color: v.color, hex: v.colorHex })))
  ).map((str) => JSON.parse(str));

  const selectedColor = selectedVariant?.color;
  const availableSizes = variants.filter((v) => v.color === selectedColor);

  const handleColorChange = (color: string) => {
    const variant = variants.find(
      (v) => v.color === color && v.stock > 0
    ) || variants.find((v) => v.color === color);
    if (variant) onVariantChange(variant);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm">Color</h3>
          <span className="text-sm text-gray-600">{selectedColor}</span>
        </div>
        <div className="flex gap-3">
          {uniqueColors.map(({ color, hex }) => {
            const hasStock = variants.some((v) => v.color === color && v.stock > 0);
            const isSelected = selectedColor === color;

            return (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                disabled={!hasStock}
                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-black ring-2 ring-black ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!hasStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: hex }}
                aria-label={`${color}${!hasStock ? ' (Out of stock)' : ''}`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check
                      className="w-6 h-6"
                      style={{
                        color: hex === '#f8fafc' ? '#000' : '#fff',
                      }}
                    />
                  </motion.div>
                )}
                {!hasStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-px h-14 bg-gray-400 rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-3">
          {availableSizes.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isOutOfStock = variant.stock === 0;

            return (
              <button
                key={variant.id}
                onClick={() => onVariantChange(variant)}
                disabled={isOutOfStock}
                className={`relative px-4 py-3 rounded-lg border-2 transition-all text-center ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : isOutOfStock
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-label={`Size ${variant.size}${
                  isOutOfStock ? ' (Out of stock)' : ''
                }`}
              >
                {variant.size}
                {isOutOfStock && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedVariant && selectedVariant.stock === 0 && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Notify me when available
          </motion.button>
        )}

        {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-orange-600"
          >
            Only {selectedVariant.stock} left in stock!
          </motion.p>
        )}
      </div>
    </div>
  );
}
