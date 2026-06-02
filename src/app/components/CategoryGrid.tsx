import { motion } from 'motion/react';
import { Laptop, Shirt, Sparkles, Home, Dumbbell, BookOpen, Gamepad2, ShoppingBasket, LucideIcon } from 'lucide-react';
import categoriesData from '../../data/categories.json';

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
  ShoppingBasket,
};

interface CategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
      {categoriesData.map((category, index) => {
        const Icon = iconMap[category.icon] || Laptop;
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect?.(category.id)}
            className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
